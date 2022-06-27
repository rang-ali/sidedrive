<template>
  <div>
    <Tree
      :modelValue="props.modelValue"
      :expandedIds="props.expandedIds"
      :loadingIds="props.loadingIds"
      :selectedIds="props.selectedIds"
      :dragToRoot="props.dragToRoot"
      ref="slVueTree"
      @drop="nodeDropped"
      @update:modelValue="emit('update:modelValue', $event)"
      @update:expandedIds="emit('update:expandedIds', $event)"
      @update:selectedIds="emit('update:selectedIds', $event)"
      @dragTo="emit('dragTo', $event)"
      @dragChange="onDragChange"
      @mouseleave="onMouseleave"
    >
      <template #title="{ node, node: { data: { id } }, toggle, hasHover: hasDragHover, isDragging, selected }">
        <GTreeItem
          v-if="node.data.isLoadMore"
          :icon="'loadMore'"
          :name="node.data.isLoading ? 'Loading' : 'Load more'"
          :loading="node.data.isLoading"
          class="hover:bg-gray-100 active:bg-gray-200"
          @click.exact="node.data.isLoading ? null : emit('click', node)"
          @mouseover="tooltipNode = null"
        />
        <GTreeItem
          v-else-if="files[id]"
          :mimeType="files[id].mimeType"
          :expanded="props.expandedIds.includes(id)"
          :folderColor="files[id].folderColorRgb"
          :iconLink="files[id].iconLink"
          :shared="files[id].shared"
          :name="files[id].name"
          :showPlus="!files[id].trashed && files[id].mimeType === 'application/vnd.google-apps.folder' && files[id].capabilities.canAddChildren"
          :showMore="true"
          :class="[
            {
              'bg-gray-100': tooltipNode?.data.id === id && contextMenuIsVisible,
              'bg-primary-100 ring-2 ring-primary-300 ring-inset': hasDragHover,
            },
            selectedFileId === id && 'bg-primary-100 bg-opacity-100 hover:bg-primary-200 hover:bg-opacity-60 active:bg-primary-100 text-black',
            selected && 'bg-primary-100 bg-opacity-80',
            selected && selectedFileId === id && selectedIds.length > 1 && 'ring-inset ring-2 ring-primary-200',
            selectedFileId !== id && !selected && !isDragging && 'hover:bg-gray-100 active:bg-gray-200',
          ]"
          class="transition-colors"
          @contextmenu="$event => showContextMenu({ node, event: $event.event, element: $event.element })"
          @click.exact="$event => onClick({ event: $event, node, toggle })"
          @mouseover="onMouseover({ event: $event, node })"
          @createMenu="showCreateMenu($event)"
        />
      </template>
      <template #emptyNode="{ node }">
        <GTreeEmptyItem :loading="loadingIds.includes(node.data.id)" />
      </template>
      <template #draginfo>
        <template v-if="props.selectedIds.length">
          <div
            v-if="props.selectedIds.length > 1"
            class="bg-red-500 w-5 h-5 text-white font-semibold text-xs flex items-center justify-center rounded-full absolute top-1 left-1 z-10"
          >
            {{ props.selectedIds.length }}
          </div>
          <div
            v-for="(nodeId, i) in props.selectedIds"
            :key="nodeId"
            :style="props.selectedIds.length > 1 && {
              transform: `translate(${3 * (props.selectedIds.length - i) + 7}px, ${3 * (props.selectedIds.length - i) + 7}px)`,
            }"
            class="
              flex
              items-center
              leading-none
              p-2
              w-48
              h-8
              shadow-lg
              rounded-md
              bg-white
              pointer-events-none
              border
              border-gray-200
              select-none
              absolute
              left-0
              top-0
            "
          >
            <GIcon
              v-if="files[nodeId].mimeType === 'application/vnd.google-apps.folder'"
              :name="files[nodeId].shared ? 'folderShared' : 'folder'"
              :style="{ color: files[nodeId].folderColorRgb }"
              style="margin-left: -2px;"
              size="18"
            />
            <img
              v-else
              :src="files[nodeId].iconLink.replace('https://drive-thirdparty.googleusercontent.com/16/', 'https://drive-thirdparty.googleusercontent.com/32/')"
              width="14"
              height="14"
            >
            <div class="truncate overflow-ellipsis w-full pl-2 text-sm text-opacity-70">
              {{ files[nodeId].name }}
            </div>
          </div>
        </template>
      </template>
    </Tree>
    <FileTooltip
      ref="tooltipRef"
      :show="tooltipNode && allowsTooltip && canShowTooltip && !contextMenuIsVisible"
      :file="tooltipNode ? files[tooltipNode.data.id] : null"
      :position="tooltipPosition"
    />
    <FileContextMenu
      v-if="tooltipNode"
      ref="contextMenuRef"
      :file="files[tooltipNode.data.id]"
      v-model:open="contextMenuIsVisible"
    />
    <FileCreate
      v-if="tooltipNode"
      ref="createMenuRef"
      compact
      :parent-id="tooltipNode.data.id"
      transition="scale-sm"
      position="bottom-left"
      v-model:open="contextMenuIsVisible"
    />
  </div>
</template>
<script>
export default {
  inheritAttrs: false,
}
</script>

<script setup>
import { ref, computed, nextTick, defineEmits } from 'vue';
import useStore from '@/store';
import Tree from '@/components/tree/index.vue';
import GTreeItem from '@/components/GTreeItem.vue';
import GTreeEmptyItem from '@/components/GTreeEmptyItem.vue';
import FileContextMenu from '@/components/FileContextMenu.vue';
import FileCreate from '@/components/FileCreate.vue';
import FileTooltip from '@/components/FileTooltip.vue';
import GIcon from '@/components/GIcon.vue';
import Popup from '@/components/Popup.vue';

const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
  expandedIds: {
    type: Array,
    required: true,
  },
  loadingIds: {
    type: Array,
    required: true,
  },
  selectedIds: {
    type: Array,
    required: true,
  },
  dragToRoot: {
    type: Boolean,
    default: false,
  },
});

const contextMenuIsVisible = ref(false);
const lastEvent = ref('No last event');
const canShowTooltip = ref(false);
const tooltipNode = ref(null);
const tooltipPosition = ref({
  top: null,
  left: null,
});
const tooltipTimeout = ref(null);
const activeElement = ref(null);
const tooltipRef = ref(null);
const createMenuRef = ref(null);
const contextMenuRef = ref(null);

const { files, selectedFileId, menuWidth, showFileTooltip, isDragging } = useStore();

const allowsTooltip = computed(() => showFileTooltip.value && !isDragging.value);

const emit = defineEmits(['click', 'update:modelValue', 'update:expandedIds', 'update:selectedIds', 'dragTo']);

const onClick = ({ event, node, toggle }) => {
  if (files.value[node.data.id].mimeType === 'application/vnd.google-apps.folder') {
    toggle(event, node);
    if (props.expandedIds.includes(node.data.id)) return; // Don't emit if it's about to close
  }
  emit('click', node);
};

const onDragChange = (val) => {
  isDragging.value = val;
};

const nodeDropped = (nodes, position, event) => {
  lastEvent.value = `Nodes: ${nodes.map(node => node.title).join(', ')} are dropped ${position.placement} ${position.node.title}`;
};

const showContextMenu = ({ node, event, element }) => {
  event?.preventDefault();
  nextTick(() => {
    contextMenuIsVisible.value = true;
  });
  const $contextMenu = contextMenuRef.value;
  $contextMenu.show({ event, element: element || activeElement.value });
};

const showCreateMenu = (event) => {
  contextMenuIsVisible.value = true;
  createMenuRef.value.show({ element: event.target })
};

const onMouseover = ({ event, node }) => {
  tooltipNode.value = node;

  const el = event.target.closest('.vue-tree-node-item');
  activeElement.value = el;
  if (!el || !allowsTooltip.value) return;

  const { top } = el.getBoundingClientRect();

  if (!tooltipTimeout.value) {
    tooltipTimeout.value = setTimeout(() => {
      canShowTooltip.value = true;
    }, 300);
  }

  const MARGIN = 10;

  nextTick(() => {
    const height = tooltipRef?.value?.$el?.getBoundingClientRect?.().height;
    tooltipPosition.value = {
      top: height + top + MARGIN > window.innerHeight ? `${window.innerHeight - height - MARGIN}px` : `${top - MARGIN}px`,
      left: `${menuWidth.value + MARGIN }px`,
    };
  });
};

const onMouseleave = () => {
  clearTimeout(tooltipTimeout.value);
  tooltipTimeout.value = null;
  canShowTooltip.value = false;
};

</script>

