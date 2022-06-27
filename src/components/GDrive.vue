<template>
  <div class="mt-1.5">
    <div class="flex justify-between pr-1">
      <div
        v-tippy="{
          content: `Click to ${isExpanded ? 'hide' : 'show'} ${name}`,
          placement: 'top-start',
        }"
        class="inline-flex items-center px-3 -ml-1 pb-1 text-gray-600 font-medium select-none cursor-pointer btn rounded-md"
        @click="onToggleParentList"
      >
        <div>{{ name }}</div>
      </div>
      <transition
        enter-active-class="transition"
        leave-active-class="transition"
        enter-from-class="opacity-0"
        enter-to-class="opacity-1"
        leave-class="opacity-1"
        leave-to-class="opacity-0"
      >
        <div
          v-if="menuHasHover && isMyDrive"
          class="
            cursor-pointer
            items-center
            justify-center
            inline-flex
            h-[20px]
            w-[20px]
            hover:bg-black
            hover:bg-opacity-10
            active:bg-opacity-20
            rounded-full
            bg-gray-100
          "
          v-tippy="{
            content: 'Add file inside',
            placement: 'bottom',
          }"
          @click.stop.prevent="showCreateMenu"
        >
          <GIcon
            class="pointer-events-none text-gray-500"
            name="plus"
            size="14"
          />
        </div>
      </transition>
    </div>
    <GTreeEmptyItem
      v-if="isExpanded && ((!hasLoadedOnce && isLoading) || !list.length)"
      :loading="isLoading"
    />
    <GTree
      v-else-if="hasLoadedOnce"
      v-show="isExpanded"
      v-model="list"
      v-model:expandedIds="expandedIds"
      v-model:selectedIds="selectedIds"
      :loadingIds="loadingIds"
      :dragToRoot="isMyDrive"
      @click="$event => onFileClick({ node: $event })"
      @dragTo="onDrag"
    />
    <FileCreate
      ref="createMenu"
      compact
      transition="scale-sm"
      :parent-id="type"
      position="bottom-left"
      v-model:open="menuIsOpen"
    />
  </div>
</template>

<script setup>
import { ref, defineProps, computed } from 'vue';
import getTree from '@/lib/tree';
import useStore from '@/store';
import GTree from '@/components/GTree.vue';
import GIcon from '@/components/GIcon.vue';
import FileCreate from '@/components/FileCreate.vue';
import GTreeEmptyItem from '@/components/GTreeEmptyItem.vue';
import { pushOrUpdateArray } from '@/utils';
import {firstBy} from 'thenby';

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  openOnStart: {
    type: Boolean,
    default: false,
  },
});

const nodes = ref([]);
const expandedIds = ref([]);
const loadingIds = ref([]);
const selectedIds = ref([]);
const loadMoreNodes = ref({});

const isMyDrive = computed(() => !['recent', 'starred', 'shared', 'trash'].includes(props.type));

const menuIsOpen = ref(false);
const createMenu = ref(null);
const showCreateMenu = (event) => {
  menuIsOpen.value = true;
  createMenu.value.show({ element: event.target })
};

const { files, updateFile, menuHasHover, filesArray, fetchFiles, handleError, selectFile } = useStore();

const handleFetchResponse = ({ result, fetchMore }, callback) => {
  let newFiles = result;

  if (fetchMore) {
    const parentId = newFiles[newFiles.length - 1].parents?.[0] || 'root';
    loadMoreNodes.value[parentId] = {
      node: {
        id: 'loadMore-' + parentId,
        data: {
          id: 'loadMore-' + parentId,
          isLoadMore: true,
          isLoading: false,
        },
        parents: [parentId],
        isLeaf: true,
        isDraggable: false,
        isSelectable: false,
      },
      func: async () => {
        loadMoreNodes.value[parentId].node.data.isLoading = true;
        // TODO - Error handling
        const res = await fetchMore();
        delete loadMoreNodes.value[parentId];
        handleFetchResponse(res);
      },
    }
  }

  if (callback) newFiles = callback(newFiles);

  newFiles.forEach((x) => {
    files.value[x.id] = x;
  });
}

const onFileClick = async ({ node }) => {
  if (node.data.isLoadMore) {
    await loadMoreNodes.value[node.data.id.split('loadMore-')[1]].func();
    return;
  }

  const file = files.value[node.data.id];
  if (file.mimeType === 'application/vnd.google-apps.folder') {
    loadingIds.value.push(node.data.id);
    const fetchResponse = await getFilesWithParentId(file.id);
    handleFetchResponse(fetchResponse);

    loadingIds.value = loadingIds.value.filter(x => x !== node.data.id);
  } else {
    selectFile(file.id);
  }
};

const getFilesWithParentId = async (id) => {
  return await fetchFiles({
    q: `'${id}' in parents and trashed = false`,
    orderBy: 'folder,name asc,modifiedTime desc',
  });
}

const populateNodeArr = (nodes, { dragAllowed }) => {
  return nodes.map(x => ({
    data: {
      ...x.data,
      id: x.id,
    },
    id: x.id,
    isLeaf: x.mimeType !== 'application/vnd.google-apps.folder',
    isDraggable: dragAllowed ? x.capabilities?.canEdit : false,
    isSelectable: true,
    parents: x.parents || x.shared && 'shared',
  }));
};

const isExpanded = ref(false);
const isLoading = ref(false);
const hasLoadedOnce = ref(false);

const onToggleParentList = async () => {
  isExpanded.value = !isExpanded.value;
  isLoading.value = true;

  if (!isExpanded.value) return;

  try {
    const mapObj = {
      recent: {
        q: "trashed = false and mimeType != 'application/vnd.google-apps.folder'",
        orderBy: 'viewedByMeTime desc',
      },
      starred: {
        q: 'starred = true and trashed = false',
        orderBy: 'sharedWithMeTime', // folder,name,modifiedTime desc
      },
      shared: {
        q: 'sharedWithMe and trashed = false',
        orderBy: 'folder,name,modifiedTime desc',
      },
      trash: {
        q: 'trashed = true',
        orderBy: 'modifiedTime desc',
      },
      default: (id) => ({
        q: `'${id}' in parents and trashed = false`,
        orderBy: 'folder,name,modifiedTime desc',
      }),
    };

    const fetchResponse = await fetchFiles(mapObj[props.type] || mapObj.default(props.type));

    const callback = props.type === 'shared' ? arr => arr.map(x => { x.shared = true; return x }) : undefined;
    handleFetchResponse(fetchResponse, callback);

  } catch (error) {
    handleError(error)
  } finally {
    isLoading.value = false;
    hasLoadedOnce.value = true;
  }
}

if (props.openOnStart) {
  onToggleParentList();
}

const list = computed(() => {
  let myDriveList = filesArray.value;

  let sorted = myDriveList;

  switch (props.type) {
    case 'recent':
      myDriveList = myDriveList.filter(x => !x.trashed && x.mimeType !== 'application/vnd.google-apps.folder');
      sorted = myDriveList.sort(firstBy(x => x.viewedByMeTime, { direction: 'desc' }));
      break;
    case 'trash':
      myDriveList = myDriveList.filter(x => x.trashed);
      sorted = myDriveList.sort(firstBy(x => x.modifiedTime, { direction: 'desc' }));
      break;
    case 'starred':
      myDriveList = myDriveList.filter(x => x.starred && !x.trashed);
      sorted = myDriveList.sort(
        firstBy(a => a.mimeType === 'application/vnd.google-apps.folder', { direction: 'desc' })
        .thenBy('name', { ignoreCase: true })
        .thenBy(a => a.modifiedTime)
      )
      break;
    case 'shared':
      myDriveList = myDriveList.filter(x => x.shared);
      sorted = myDriveList.sort(firstBy(x => x.sharedWithMeTime, { direction: 'desc' }));
      break;
    default:
      myDriveList = myDriveList.filter(x => !x.trashed); // x.parents?.includes(props.type) &&
      sorted = myDriveList.sort(
        firstBy(x => x.mimeType === 'application/vnd.google-apps.folder', { direction: 'desc' })
        .thenBy('name', { ignoreCase: true, direction: 'asc' })
        .thenBy(x => x.modifiedTime, { direction: 'desc' })
      )
      break;
  }

  const populated = populateNodeArr(sorted, { dragAllowed: !['recent', 'trashed'].includes(props.type) });

  const loadMoreArr = Object.values(loadMoreNodes.value).map(x => x.node);
  populated.push(...loadMoreArr)

  return getTree(populated, isMyDrive.value ? { rootId: props.type } : undefined);
});

const onDrag = ({ payload, to }) => {
  payload.forEach(id => {
    const oldParentId = files.value[id].parents[0];

    if (to === 'root' && !isMyDrive.value) {
      // This can not be supported
      return;
    }
    
    updateFile(id, {
      addParents: to === 'root' && isMyDrive.value ? props.type : to,
      removeParents: oldParentId,
    });
  });
}
</script>
