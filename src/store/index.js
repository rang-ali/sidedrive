import { toRef, ref, computed } from "vue";
import { createGlobalState, useStorage } from '@vueuse/core';
import * as Sentry from '@sentry/vue';
import { extractError } from "@/utils";

const state = {
  isLoading: ref(false),
  isCreatingFile: ref(false),
  files: ref({}),
  user: useStorage('user', {}),
  isSignedIn: useStorage('isSignedIn', false),
  authUser: ref(null),
  grantedMetadata: ref(false),
  grantedDrive: ref(false),
  selectedFileId: ref(null), // useStorage('selectedFileId', ''),
  isDragging: ref(false),
  menuWidth: useStorage('menuWidth', 300),
  folderColors: useStorage('folderColors', []),
  showFileTooltip: useStorage('showFileTooltip', true),
  usePointerCursor: useStorage('usePointerCursor', false),
  menuIsCollapsed: useStorage('menuIsCollapsed', false),
  menuHasHover: ref(false),
  popupIsOpen: ref(false),
  showSearch: ref(false),
  showSignIn: ref(false),
  toasts: ref([]),
}

const createGrantDriveToast = ({ type } = {}) => {
  const types = {
    copy: 'You need to grant Sidedrive permissions for modifying files if you want to be able to copy files.',
    create: 'You need to grant Sidedrive permissions for modifying files if you want to be able to create files.',
    move: 'You need to grant Sidedrive permissions for modifying files if you want to be able to move files.',
    default: 'You need to grant Sidedrive permissions for modifying files if you want to be able to do that action.',
  }
  return {
    code: 'global',
    domain: '',
    reason: 'appNotAuthorizedToFile',
    message: types[type] || types.default,
    timeout: null,
  };
}

const handleError = (error) => {
  const extracted = extractError(error);
  const equalsTo = (error, code, domain, reason) => error.code === code && error.domain === domain && error.reason === reason;
  
  if (!['appNotAuthorizedToFile', 'insufficientPermissions'].includes(extracted?.reason)) {
    Sentry.captureException(error);
  }

  if (!extracted.code) return;

  let newToast = {
    code: extracted.code,
    domain: extracted.domain,
    reason: extracted.reason,
  };

  if (equalsTo(extracted, 403, 'usageLimits', 'dailyLimitExceeded')) {
    newToast.message = 'Too many users are using Sidedrive right now and we\'ve been rate limited until midnight pacific time. Please come back tomorrow.';
  } else if (equalsTo(extracted, 403, 'usageLimits', 'rateLimitExceeded')) {
    newToast.message = 'Too many users are using Sidedrive right now and we\'ve been rate limited. Wait a couple of minutes before trying again';
  } else if (equalsTo(extracted, 403, 'usageLimits', 'userRateLimitExceeded')) {
    newToast.message = 'You have been rate limited. Wait a couple of minutes before trying again.';
  } else if (extracted.reason === 'appNotAuthorizedToFile') {
    newToast = createGrantDriveToast();
  // } else if (extracted.reason === 'insufficientPermissions') {
  //   state.insufficientPermissions.value = true;
  //   return;
  } else {
    // TODO - Add a preface with the following text: Sorry, something went wrong. Here's what the Google API responded with:
    newToast.message = extracted.message;
  }

  addToast(newToast);
};

const addToast = (obj) => {
  const dateNow = Date.now();
  const randomId = Math.random() + dateNow;
  const disposeFunc = (id) => state.toasts.value = state.toasts.value.filter(x => x.id !== id);
  const lastToastError = state.toasts?.value?.[state.toasts?.value.length - 1];

  if (
    lastToastError &&
    lastToastError.code === obj.code &&
    lastToastError.domain === obj.domain &&
    lastToastError.reason === obj.reason &&
    dateNow - state.toasts.value[state.toasts.value.length - 1].createdAt < 1000
  ) {
    // A similar error has already been added to the toast array. No need to add it again.
    return;
  }

  const newToast = {
    timeout: 8000,
    dispose: () => disposeFunc(randomId),
    id: randomId,
    createdAt: dateNow,
    ...obj,
  }

  state.toasts.value = [newToast, ...state.toasts.value];
}

const onLogout = ({ reload = true } = {}) => {
  window.gapi.auth2.getAuthInstance().signOut();
  state.files.value = {};
  state.user.value = {};
  state.menuIsCollapsed.value = false;
  state.selectedFileId.value = '';
  state.isSignedIn.value = false;
  if (reload) window.location.reload(); // Need to reset the gapi-client if the user is gonna switch accounts
}

export const fileFields = 'createdTime, fileExtension, folderColorRgb, hasThumbnail, thumbnailLink, iconLink, id, lastModifyingUser, shared, starred, mimeType, modifiedTime, name, parents, viewedByMeTime, sharedWithMeTime, contentHints, trashed, webContentLink, webViewLink, trashedTime, capabilities(canRename, canTrash, canAddChildren, canEdit, canCopy, canDownload)';
export const listFields = `nextPageToken, files(${fileFields})`;

const fetchFiles = async (fetchParams, { nextPageToken = '' } = {}) => {
  try {
    state.isLoading.value = true;
    const drive = window.gapi.client.drive;
    const fileList = [];
  
    const params = {
      ...fetchParams,
      fields: listFields,
      pageToken: nextPageToken || '',
      pageSize: 50,
    };
    const { result } = await drive.files.list(params);
    Array.prototype.push.apply(fileList, result.files);
    nextPageToken = result.nextPageToken;
  
    const fetchMoreFunc = nextPageToken ? async () => await fetchFiles(fetchParams, { nextPageToken }) : null;
  
    return {
      result: fileList,
      fetchMore: fetchMoreFunc,
    };
  } catch (error) {
    handleError(error);
  } finally {
    state.isLoading.value = false;
  }
};

export default createGlobalState(() => {
  return {
    ...state,
    filesArray: computed(() => Object.values(state.files.value)),
    insufficientPermissions: computed(() => (state.grantedDrive.value || state.grantedMetadata.value) ? false : true),
    login: () => window.gapi.auth2.getAuthInstance().signIn(),
    logout: onLogout,
    handleError,
    fetchFiles,
    selectFile: (payload) => {
      let id;
      if (typeof payload === 'string') id = payload;
      else {
        id = payload.id;
        state.files.value[id] = payload;
      }

      state.selectedFileId.value = id;
      document.title = state.files.value[id].name;
    },
    createFile: async (type, params = {}) => {
      if (!state.grantedDrive.value) {
        addToast(createGrantDriveToast({ type: 'create' }));
        return;
      }
      const types = {
        'folder': {
          name: 'New Folder',
          mimeType: 'application/vnd.google-apps.folder',
        },
        'document': {
          name: 'Untitled Document',
          mimeType: 'application/vnd.google-apps.document',
        },
        'sheets': {
          name: 'Untitled Spreadsheet',
          mimeType: 'application/vnd.google-apps.spreadsheet',
        },
        'slides': {
          name: 'Untitled Presentation',
          mimeType: 'application/vnd.google-apps.presentation',
        },
        'drawing': {
          name: 'Untitled Drawing',
          mimeType: 'application/vnd.google-apps.drawing',
        },
      };
      try {
        if (!types[type]) return;

        state.isLoading.value = true;
        if (type !== 'folder') state.isCreatingFile.value = true;
  
        const { result } = await gapi.client.drive.files.create({
          resource: {
            ...types[type],
            ...params,
          },
          fields: fileFields,
        });

        state.files.value[result.id] = result;

        if (type !== 'folder') {
          // TODO - scroll into view in menu list
          state.selectedFileId.value = result.id;
        }
      } catch (error) {
        handleError(error);
      } finally {
        // Hack: Since the create request is superfast but loading the iframe takes a lot time.
        // A delayed isLoading-setter is used
        setTimeout(() => {
          state.isLoading.value = false;
          state.isCreatingFile.value = false;
        }, 1500);
      }
    },
    updateFile: async (id, body, { eager = true } = {}) => {
      const srcFile = toRef(state.files.value, id);
      if (!srcFile) return;
      let oldVals = {};
      let newVals = {};

      try {
        state.isLoading.value = true;

        if (eager) {
          if (body.resource) {
            newVals = body.resource;
            oldVals = Object.keys(newVals).reduce((sum, next) => {
              sum[next] = srcFile.value[next];
              return sum;
            }, {});
          } else if (body.addParents && body.removeParents) {
            if (!state.grantedDrive.value) {
              addToast(createGrantDriveToast({ type: 'move' }));
              return;
            }
            oldVals = {
              parents: srcFile.value.parents,
            };
            newVals = {
              // Note: Filtering old values must be done first in case the file is dropped on the same position
              parents: [...oldVals.parents.filter(x => x !== body.removeParents), body.addParents],
            };
          }
          Object.assign(srcFile.value, newVals);
        }

        const { result } = await gapi.client.drive.files.update({
          fileId: id,
          ...body,
          fields: fileFields,
        });

        srcFile.value = result;
      } catch (error) {
        handleError(error);
        if (eager) srcFile.value = { ...srcFile.value, ...oldVals };
      } finally {
        state.isLoading.value = false;
      }
    },
    copyFile: async (id) => {
      if (!state.grantedDrive.value) {
        addToast(createGrantDriveToast({ type: 'copy' }));
        return;
      }
      try {
        state.isLoading.value = true;
        state.isCreatingFile.value = true;

        const { result } = await gapi.client.drive.files.copy({
          fileId: id,
          fields: fileFields,
        });

        state.files.value[result.id] = result;
        state.selectedFileId.value = result.id;
      } catch (error) {
        handleError(error);
      } finally {
        state.isLoading.value = false;
        state.isCreatingFile.value = false;
      }
    },
    removeFile(id) {
      this.updateFile(id, { trashed: true });
    },
    addToast,
  }
});
