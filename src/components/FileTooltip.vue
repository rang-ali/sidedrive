<template>
  <transition
    enter-active-class="transition"
    leave-active-class="transition"
    enter-from-class="opacity-0"
    enter-to-class="opacity-1"
    leave-class="opacity-1"
    leave-to-class="opacity-0"
  >
    <div
      v-if="file"
      ref="tooltip"
      :style="[position, { opacity: show ? 1 : 0 }]"
      class="p-1 bg-white fixed w-56 border border-gray-100 z-100 pointer-events-none select-none transition-all ease-out rounded-[5px]"
      style="
        box-shadow: rgba(0, 0, 0, 0.12) 0px 4px 8px, rgba(0, 0, 0, 0.24) 0px 4px 8px -2px;
      "
    >
      <div class="w-full h-36 overflow-hidden mb-3 border border-gray-200 border-opacity-60 bg-gray-50 relative rounded-[3px]">
        <div class="inset-0 skeleton-box bg-gray-200 bg-opacity-20 h-full absolute" />
        <img
          v-if="file.hasThumbnail"
          :key="file.id"
          :src="isSafari()
            ? file.thumbnailLink
            : `https://drive.google.com/thumbnail?authuser=${authUser}&sz=w220-h400&id=${file.id}`
          "
          referrerPolicy="no-referrer"
          class="w-full h-auto relative"
          alt=""
        >
        <div
          v-else
          class="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-gray-50 relative"
        >
          <template v-if="file.mimeType === 'application/vnd.google-apps.folder'">
            <GIcon
              :style="{ color: file.folderColorRgb }"
              class="text-gray-200"
              :key="file.shared"
              :name="file.shared ? 'folderSharedHiDef' : 'folderHiDef'"
              size="52"
            />
            <div class="text-sm pt-1">
              {{file.shared ? 'Shared' : 'Private'}} folder
            </div>
          </template>
          <template v-else>
            <GIcon class="text-gray-200" name="image" size="32" />
            <div class="text-sm pt-1">Preview unavailable</div>
          </template>
        </div>
        <div class="text-xs text-gray-600 mb-1 absolute right-2 top-2 py-1 px-2 bg-gray-50 bg-opacity-90 leading-none rounded-sm break-text">
          {{ getMimeDesc(file.fileExtension ? '.' + file.fileExtension : file.mimeType) }}
        </div>
      </div>
      <div class="px-2 pb-1">
        <div class="pb-3 break-text leading-tight">{{ file.name }}</div>
        <div class="text-xs text-gray-600 mb-1 leading-tight break-text">
          Last edited by {{ file.lastModifyingUser?.displayName || 'Unknown' }}
        </div>
        <div class="text-xs text-gray-600 mb-1 leading-tight break-text">
          {{ timeAgo(file.modifiedTime) }}
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { defineProps } from 'vue';
import { timeAgo, isSafari } from '@/utils';
import useStore from '@/store';
import GIcon from '@/components/GIcon.vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  file: {
    type: Object,
    default: null,
  },
  position: {
    type: Object,
    default: null,
  },
});

const { authUser } = useStore(); 

const getMimeDesc = (str) => {
  const map = {
    'application/vnd.google-apps.audio': 'Audio',
    'application/vnd.google-apps.document': 'Docs',
    'application/vnd.google-apps.drive-sdk':'3rd party shortcut',
    'application/vnd.google-apps.drawing': 'Drawing',
    'application/vnd.google-apps.file': 'Drive file',
    'application/vnd.google-apps.folder': 'Folder',
    'application/vnd.google-apps.form': 'Forms',
    'application/vnd.google-apps.fusiontable': 'Fusion Tables',
    'application/vnd.google-apps.map': 'My Maps',
    'application/vnd.google-apps.photo': 'Photo',
    'application/vnd.google-apps.presentation': 'Slides',
    'application/vnd.google-apps.script': 'Apps Scripts',
    'application/vnd.google-apps.shortcut': 'Shortcut',
    'application/vnd.google-apps.site': 'Sites',
    'application/vnd.google-apps.spreadsheet': 'Sheets',
    'application/vnd.google-apps.unknown': 'Unknown',
    'application/vnd.google-apps.video': 'Video',
  }

  if (map[str]) return map[str];

  return str;
};

</script>
