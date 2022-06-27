<template>
  <div class="flex flex-nowrap w-full h-screen overflow-hidden">
    <TheMenu>
      <template v-if="!insufficientPermissions && rootFolder">
        <div
          class="
            inline-flex
            items-center
            px-3
            -ml-1
            py-1
            w-full
            text-gray-600
            font-medium
            select-none
            cursor-pointer
            btn
            rounded-md
            mb-8
          "
          @click="showSearch = true"
        >
          <GIcon name="search" size="18" class="-mb-px opacity-80" />
          <div class="pl-2">Search</div>
        </div>
        <GDrive
          v-for="(drive, i) in [
            { name: 'Recent', type: 'recent', openOnStart: false },
            { name: 'Starred', type: 'starred' },
            { name: 'Shared', type: 'shared' },
            { name: rootFolder.name || 'My drive', type: rootFolder.id, openOnStart: true },
            ...sharedDrives,
            { name: 'Trash', type: 'trash' },
          ]"
          :key="i"
          :name="drive.name"
          :type="drive.type"
          :icon="drive.icon"
          :openOnStart="drive.openOnStart"
        />
      </template>
    </TheMenu>
    <div v-if="!menuIsCollapsed" class="w-0 h-full relative">
      <div
        :class="isResizing && 'bg-primary-500 bg-opacity-100'"
        class="w-[7px] absolute right-0 top-0 bottom-0 group h-full cursor-col-resize hover:bg-primary-500 hover:bg-opacity-10 active:bg-opacity-40 z-20 transition-colors"
        style="transform: translateX(3px)"
        @mousedown="isResizing = true"
      >
        <div class="w-[2px] ml-[3px] bg-gray-200 h-full cursor-col-resize group-hover:bg-primary-300 group-active:bg-primary-500 group-active:bg-opacity-100 transition-colors" />
      </div>
    </div>
    <ErrorView v-if="hasTriedSignedIn && isSignedIn && insufficientPermissions" />
    <GView v-else-if="isSignedIn" />
    <StartView v-else />
    <div v-if="isResizing" class="fixed inset-0 z-50"/>
    <SignInPopup />
    <OmniBar />
    <component v-if="isResizing" :is="'style'">
      * {
        cursor: grabbing !important;
      }
    </component>
    <Toasts />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useIntervalFn, useWindowFocus } from '@vueuse/core'
import TheMenu from '@/components/TheMenu.vue';
import GView from '@/components/GView.vue';
import OmniBar from '@/components/OmniBar.vue';
import Toasts from '@/components/Toasts.vue';
import GIcon from '@/components/GIcon.vue';
import GDrive from '@/components/GDrive.vue';
import SignInPopup from '@/components/SignInPopup.vue';
import ErrorView from '@/components/ErrorView.vue';
import StartView from '@/components/StartView.vue';
import useStore, { fileFields } from '@/store';

const rootFolder = ref(null);
const hasTriedSignedIn = ref(false);
const sharedDrives = ref([]);

const {
  menuWidth,
  menuIsCollapsed,
  user,
  folderColors,
  files,
  isSignedIn,
  authUser,
  logout,
  insufficientPermissions,
  handleError,
  showSearch,
  grantedMetadata,
  grantedDrive,
} = useStore();


const CLIENT_ID = import.meta.env.VITE_GOOGLE_DRIVE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY;
const SCOPES = 'https://www.googleapis.com/auth/drive.metadata https://www.googleapis.com/auth/drive';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

const updateSigninStatus = async (isAuthed) => {
  isSignedIn.value = isAuthed;
  if (!isAuthed) {
    return logout({ reload: false });
  }
  hasTriedSignedIn.value = true;

  const getDrive = window.gapi.client.drive.about.get({ fields: 'folderColorPalette, user(displayName, emailAddress, photoLink)' });
  const getRoot = window.gapi.client.drive.files.get({ fileId: 'root' });
  const getSharedDrives = window.gapi.client.drive.drives.list();

  authUser.value = window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
  const authResponse = window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse();

  const gapiUser = window.gapi.auth2.getAuthInstance().currentUser.get();
  grantedMetadata.value = gapiUser.hasGrantedScopes('https://www.googleapis.com/auth/drive.metadata');
  grantedDrive.value = gapiUser.hasGrantedScopes('https://www.googleapis.com/auth/drive');

  authUser.value = authResponse?.session_state?.extraQueryParams?.authuser || 0;
  user.value = {
    displayName: gapiUser.getBasicProfile().getName(),
    firstName: gapiUser.getBasicProfile().getGivenName(),
    lastName: gapiUser.getBasicProfile().getFamilyName(),
    emailAddress: gapiUser.getBasicProfile().getEmail(),
    photoLink: gapiUser.getBasicProfile().getImageUrl(),
  };

  if (insufficientPermissions.value) return;

  try {
    const batch = gapi.client.newBatch();

    batch.add(getRoot, { id: 'root' });
    batch.add(getDrive, { id: 'drive' });
    batch.add(getSharedDrives, { id: 'sharedDrives' });

    const { result } = await batch.then(x => x, function err(error) {
      handleError(error)
    });

    rootFolder.value = result.root.result;
    const { user: driveUser, folderColorPalette } = result.drive.result;

    if (result.sharedDrives.result?.drives?.length) {
      sharedDrives.value = result.sharedDrives.result?.drives?.map(x => ({ name: x.name, type: x.id })) || [];
    }

    folderColors.value = folderColorPalette;
    startPolling();
  } catch (error) {
    handleError(error);
  }
};

const startPolling = async () => {
  let pageToken = await window.gapi.client.drive.changes.getStartPageToken().then(({ result }) => result.startPageToken);
  const windowFocused = useWindowFocus();
  const fetchChanges = async () => await window.gapi.client.drive.changes.list({
    pageToken,
    fields: `newStartPageToken, changes(changeType, file(${fileFields}))`, // `file(${fileFields})`, // `newStartPageToken, files(${fileFields,
  });
  const { pause } = useIntervalFn(async () => {
    try {
      if (!isSignedIn.value || !windowFocused.value) return;
      const resp = await fetchChanges();
      pageToken = resp.result.newStartPageToken;
      if (resp.result.changes) {
        resp.result.changes.forEach(({ changeType, file }) => {
          if (changeType !== 'file') return;
          files.value[file.id] = file;
        });
      }
    } catch (error) {
      pause();
      handleError(error)
    }
  }, 10000);
};

const initClient = () => {
  window.gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES,
  })
  .then(() => {
    // Listen for sign-in state changes.
    window.gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get());
  }, function onError(error) {
    handleError(error)
  })
};

window.gapi.load('client:auth2', initClient);

const refreshToken = async () => {
  const result = await window.gapi.auth.authorize({
    client_id: CLIENT_ID,
    immediate: true,
    scope: SCOPES
  });
  if (!result?.status?.signed_in) return; // TODO - Run func again in a period of time?

  authUser.value = result.access_token;
};

// Refresh token once every 45mins
// https://github.com/google/google-api-javascript-client/blob/master/docs/faq.md#how-do-i-refresh-the-auth-token-and-how-often-should-i-do-it
useIntervalFn(refreshToken, 45 * 60 * 60 * 1000);

// Resizing
const isResizing = ref(false);
watch(isResizing, (val) => {
  if (val) {
    window.addEventListener('mousemove', moveResize, { passive: true });
    window.addEventListener('mouseup', stopResize, { passive: true });
  } else {
    window.removeEventListener('mousemove', stopResize, { passive: true });
  }
});

const stopResize = () => {
  isResizing.value = false;
  window.removeEventListener('mousemove', moveResize, { passive: true });
};

const moveResize = (e) => {
  menuWidth.value = Math.max(e.clientX, 170);
};
</script>
