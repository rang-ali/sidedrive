<template>
  <Popup
    ref="popup"
    :x-offset="compact ? 3 : 0"
    :y-offset="compact ? -3 : -11"
    :custom="true"
    :position="position"
    :transition="transition"
    @toggle="$emit('update:open', $event)"
  >
    <template #default="{ close }">
      <div
        class="
          shadow-2xl
          bg-white
          border
          border-gray-200
          rounded-lg
          overflow-hidden
          cursor-default
          p-2
        "
      >
        <div
          v-for="opt in [
            {
              label: 'Document',
              icon: 'https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_document_x64.png',
              type: 'document',
            },
            {
              label: 'Sheets',
              icon: 'https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_spreadsheet_x64.png',
              type: 'sheets',
            },
            {
              label: 'Slides',
              icon: 'https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_presentation_x64.png',
              type: 'slides',
            },
            {
              label: 'Drawing',
              icon: 'https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_drawing_x64.png',
              type: 'drawing'
            },
            {
              label: 'Folder',
              icon: 'https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_folder_x64.png',
              type: 'folder',
            },
          ]"
          :key="opt.type"
          :class="compact ? 'p-2 w-48' : 'p-3 w-56'"
          class="
            flex
            items-center
            text-gray-800
            btn
          "
          @click="() => close(() => createFile(opt.type))"
        >
          <!-- createFile returns a promise, that's why its wrapped in a function so the close-func is called immediately -->
          <img :src="opt.icon" alt="opt.label" :width="compact ? 18 : 16" :height="compact ? 18 : 16">
          <div class="pl-4">{{ opt.label }}</div>
        </div>
      </div>
    </template>
  </Popup>
</template>

<script>
import GIcon from '@/components/GIcon.vue';
import Popup from '@/components/Popup.vue';
import useStore from '@/store';

export default {
  emits: ['update:open'],
  components: {
    GIcon,
    Popup,
  },
  props: {
    position: {
      type: String,
      default: 'top-left',
    },
    compact: {
      type: Boolean,
      default: false,
    },
    transition: {
      type: String,
      default: '',
    },
    parentId: {
      type: String,
      default: null,
    },
  },
  methods: {
    createFile(type) {
      const params = this.parentId ? { parents: [this.parentId] } : {};
      return useStore().createFile(type, params);
    },
    show() {
      return this.$refs.popup.show(...arguments);
    },
  },
}
</script>
