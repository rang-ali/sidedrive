<template>
  <Popup
    ref="contextMenu"
    transition="scale-sm"
    :custom="true"
    @toggle="$emit('update:open', $event)"
  >
    <div
      v-if="file"
      class="w-64 absolute bg-white border border-gray-200 rounded-lg overflow-hidden shadow-xl"
    >
      <div class="p-2">
        <template
          v-for="(opt, i) in [
            {
              label: 'Open in new tab',
              show: !!file.webViewLink,
              onClick: () => openNewTab(file.webViewLink),
              icon: 'newWindow',
            },
            {
              label: 'Copy link',
              show: !!file.webViewLink,
              onClick: () => copyToClipboard(file.webViewLink),
              icon: 'copy',
            },
            {
              label: 'Download',
              show: !!file.webContentLink && file.capabilities.canDownload,
              onClick: () => onDownload(file.webContentLink),
              icon: 'download',
            },
            {
              label: 'Rename',
              show: !file.trashed && !!file.webViewLink && file.capabilities.canRename,
              onClick: showRename,
              icon: 'edit',
            },
            {
              label: file.starred ? 'Unstar' : 'Add to starred',
              show: !file.trashed && !!file.webViewLink,
              onClick: () => onToggleStar(file.id, !file.starred),
              icon: 'star',
            },
            {
              label: 'Duplicate',
              show: !file.trashed && file.mimeType !== 'application/vnd.google-apps.folder' && file.capabilities.canCopy,
              onClick: () => onCopyFile(file.id),
              icon: 'fileCopy',
            },
            {
              label: 'Remove',
              show: !file.trashed && file.capabilities.canTrash,
              onClick: () => onRemove(file.id),
              icon: 'remove',
            },
            {
              label: 'Restore',
              show: file.trashed && file.capabilities.canTrash,
              onClick: () => restoreFile(file.id),
              icon: 'restore',
            },
            {
              label: 'Color',
              show: !file.trashed && file.mimeType === 'application/vnd.google-apps.folder' && file.capabilities.canEdit,
              onClick: (color) => changeFolderColor(file.id, color),
              icon: 'fileCopy',
            },
          ]"
        >
          <div
            v-if="opt.show && opt.label === 'Color'"
            :key="i + 'color'"
            class="px-2.5 pt-2 pb-1 text-gray-600 border-t border-gray-100 mt-2"
          >
            <div class="text-xs pb-1">Color</div>
            <div
              class="grid"
              style="
                grid-template-columns: repeat(auto-fill, 22px);
                grid-gap: 4px;
              "
            >
              <div
                v-for="color in folderColors"
                :key="color"
                :style="{
                  backgroundColor: color
                }"
                :class="file.folderColorRgb === color && [
                  'ring-2',
                  'ring-offset-0',
                  'ring-primary-500',
                  'ring-opacity-80',
                  'border border-white'
                ]"
                class="
                  h-[22px]
                  rounded-sm
                  hover:scale-125
                  hover:shadow-lg
                  transition-all
                  duration-75
                  cursor-pointer
                  active:scale-95
                "
                @click="() => { opt.onClick(color); $refs.contextMenu.close(); }"
              />
            </div>
          </div>
          <div
            :key="i"
            v-else-if="opt.show"
            class="py-2 px-2.5 leading-none grid cursor-pointer hover:bg-gray-100 hover:bg-opacity-70"
            style="grid-template-rows: 1fr; grid-template-columns: 34px 1fr; border-radius: 4px;"
            @click="() => { opt.onClick(); $refs.contextMenu.close(); }"
          >
            <GIcon
              :name="opt.icon"
              class="text-gray-600"
              size="19"
            />
            <div class="self-center">{{ opt.label }}</div>
          </div>
        </template>
      </div>
      <div class="bg-gray-50 border-t border-gray-100 py-2 px-4 text-[12px] mt-1 text-gray-500 cursor-default">
        <div v-if="file.viewedByMeTime" class="pb-2 leading-tight">
          Last viewed by me {{ timeAgo(file.viewedByMeTime) }}.
        </div>
        <div v-if="file.createdTime" class="pb-1 leading-tight">
          Created {{ timeAgo(file.createdTime) }}.
        </div>
      </div>
    </div>
  </Popup>
  <FileRename
    v-if="file"
    :file="file"
    ref="renamePopup"
    @toggle="$emit('update:open', $event)"
  />
</template>
<script>
import useStore from '@/store';
import { timeAgo } from '@/utils';
import Popup from '@/components/Popup.vue';
import FileRename from '@/components/FileRename.vue';
import GIcon from '@/components/GIcon.vue';

export default {
  emits: ['update:open'],
  components: {
    Popup,
    GIcon,
    FileRename
  },
  props: {
    file: {
      type: Object,
      default: null,
    },
    open: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      activeElement: null,
      folderColors: useStore().folderColors.value,
    };
  },
  methods: {
    timeAgo,
    async onRemove(id) {
      await useStore().removeFile(id);
    },
    async onToggleStar(id, value) {
      await useStore().updateFile(id, { resource: { starred: value } });
    },
    async onCopyFile(id) {
      await useStore().copyFile(id);
    },
    async changeFolderColor(id, color) {
      await useStore().updateFile(id, { resource: { folderColorRgb: color } });
    },
    async restoreFile(id) {
      await useStore().updateFile(id, { resource: { trashed: false } });
    },
    show({ event, element }) {
      this.activeElement = element;
      this.$refs.contextMenu.show({ event, element });
    },
    openNewTab(str) {
      window.open(str, '_blank');
    },
    copyToClipboard(str) {
      const el = document.createElement('textarea');  
      el.value = str;                                 
      el.setAttribute('readonly', '');                
      el.style.position = 'absolute';                     
      el.style.left = '-9999px';                      
      document.body.appendChild(el);                  
      const selected = document.getSelection().rangeCount > 0  ? document.getSelection().getRangeAt(0) : false;                                    
      el.select();                                    
      document.execCommand('copy');                   
      document.body.removeChild(el);                  
      if (selected) {                                 
        document.getSelection().removeAllRanges();    
        document.getSelection().addRange(selected);   
      }
    },
    onDownload(e) {
      window.open(e, '_blank');
    },
    showRename() {
      this.$refs.renamePopup.show({ element: this.activeElement })
      this.$nextTick(() => {
        this.$emit('update:open', true);
      });
    },
  }
}
</script>