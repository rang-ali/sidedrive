<template>
  <div
    class="tree-list-item grid-rows-1 text-md items-center cursor-pointer group transition-colors select-none"
    @mouseover.passive="emit('mouseover', $event)"
    @click="emit('click', $event)"
    @contextmenu.prevent="emit('contextmenu', { event: $event })"
  >
    <div
      :class="{
        'rotate-90': props.expanded,
      }"
      class="inline-grid place-items-center transition-transform text-gray-500"
    >
      <GIcon
        v-if="props.mimeType === 'application/vnd.google-apps.folder'"
        name="chevronRight"
        size="14"
      />
    </div>
    <div class="item-icon self-center">
      <GIcon
        v-if="props.icon || props.mimeType === 'application/vnd.google-apps.folder'"
        :name="props.icon || (props.shared ? 'folderShared' : 'folder')"
        :style="{ color: props.folderColor }"
        :class="{ 'animate-spin': props.loading }"
        class="text-gray-500"
        style="margin-left: -2px;"
        size="20"
      />
      <img
        v-else
        :src="iconLink.replace('https://drive-thirdparty.googleusercontent.com/16/', 'https://drive-thirdparty.googleusercontent.com/32/')"
        width="16"
        height="16"
      >
    </div>
    <div class="truncate overflow-ellipsis w-full pl-1.5 select-none" style="line-height: 28px;">
      {{ props.name }}
    </div>
    <div class="absolute invisible right-0.5 top-0 text-gray-600 height-full flex items-center group-hover:visible group-hover:relative">
      <div
        v-if="props.showPlus"
        v-tippy="{
          content: 'Add file inside',
          placement: 'bottom',
        }"
        class="height-full p-1 cursor-pointer items-center justify-center inline-flex rounded h-[22px] hover:bg-black hover:bg-opacity-5"
        @click.stop.prevent="emit('createMenu', $event)"
      >
        <GIcon
          class="pointer-events-none"
          name="plus"
          size="16"
        />
      </div>
      <div
        v-if="props.showMore"
        v-tippy="{
          content: 'Show file menu',
          placement: 'bottom',
        }"
        class="height-full p-1 cursor-pointer items-center justify-center inline-flex rounded h-[22px] hover:bg-black hover:bg-opacity-5"
        @click.stop.prevent="$event => emit('contextmenu', { element: $event.target })"
      >
        <GIcon
          class="pointer-events-none"
          name="more"
          size="16"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import GIcon from '@/components/GIcon.vue';
import { defineEmits, defineProps } from 'vue';
const emit = defineEmits(['contextmenu', 'createMenu', 'click', 'mouseover']);

const props = defineProps({
  mimeType: { type: String, default: null },
  folderColor: { type: String, default: null },
  icon: { type: String, default: null },
  iconLink: { type: String, default: null },
  name: { type: String, default: null },
  expanded: { type: Boolean, default: false },
  shared: { type: Boolean, default: false },
  showPlus: { type: Boolean, default: false },
  showMore: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
});



</script>
<style lang="scss">
.tree-list-item {
  border-radius: 5px;
  display: flex;
  min-width: 100%;
  width: 1px;
  height: 28px;

  flex-wrap: nowrap;
  /* grid-template-rows: 28px; */
  & > div:first-child,
  & > div:nth-child(2) {
    width: 20px;
    flex: 1 0 20px;
  }
  & > div:nth-child(3) {
    flex: 1 1 auto;
    min-width: 0;
  }
  margin-right: 4px;
}
</style>
