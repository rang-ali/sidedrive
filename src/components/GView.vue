<template>
  <div
    class="w-full h-screen border-none relative z-0 bg-gray-150 flex-auto"
  >
    <VEmbed
      v-if="file"
      ref="iframe"
      :src="getIframeLink(file)"
      :className="'w-full h-full border-none'"
      class="w-full h-screen border-none bg-gray-100"
      sandbox="allow-downloads allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts allow-top-navigation"
      allow="fullscreen"
      seamless
      @iframe-load="onLoad"
    />
    <div
      v-else
      class="h-full w-full bg-opacity-50 flex items-center justify-center text-gray-500 text-md font-medium select-none"
    >
      <div>Select a file from the sidebar.</div>
    </div>
    <transition
      enter-active-class="transition-none"
      leave-active-class="transition-opacity duration-400 delay-700"
      enter-from-class="opacity-0"
      enter-to-class="opacity-1"
      leave-class="opacity-1"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isLoading"
        class="bg-gray-300 bg-opacity-50 inset-0 pointer-events-all absolute grid place-items-center h-full"
        style="z-index: 100000;"
      >
        <GIcon
          name="spinner"
          class="animate-spin text-gray-500"
          style="animation-duration: 1200ms;"
          size="42"
        />
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import GIcon from '@/components/GIcon.vue';
import useStore from '@/store';
import VEmbed from '@/components/VEmbed.vue';

const supportedMimes = [
  'application/vnd.google-apps.spreadsheet', // Confirmed, works
  'application/vnd.google-apps.drawing', // Confirmed, works
  'application/vnd.google-apps.presentation', // Confirmed, works
  'application/vnd.google-apps.document', // Confirmed, works
  'application/vnd.google-apps.file', // TODO Confirm if it works
  'application/vnd.google-apps.photo', // TODO Confirm if it works
  'application/vnd.google-apps.script', // TODO Confirm if it works
  'application/vnd.google-apps.site', // TODO Confirm if it works
  // 'application/vnd.google-apps.map', Not supported
  // 'application/vnd.google-apps.fusiontable', Shut down by Google
  // 'application/vnd.google-apps.shortcut', Not supported
  // 'application/vnd.google-apps.folder', Folders are opened in the sidebar
];

const { selectedFileId, files, isCreatingFile } = useStore();

const file = computed(() => {
  return files?.value?.[selectedFileId.value];
});

const isLoading = ref(false);
let clearIsLoading = null;

watch(selectedFileId, () => {
  if (!file.value) return;
  isLoading.value = true;

  clearTimeout(clearIsLoading);
  clearIsLoading = setTimeout(() => {
    isLoading.value = false;
  }, 10 * 1000);
});

watch(isCreatingFile, (val) => {
  val && (isLoading.value = true);
});

const onLoad = () => {
  isLoading.value = false;
  clearTimeout(clearIsLoading);
};

const getIframeLink = (obj) => {
  const str = obj.webViewLink;

  if (supportedMimes.includes(obj.mimeType)) {
    return str;
  }

  if (obj.mimeType === 'application/vnd.google-apps.form') return str.replace('/edit', '/viewform');

  return str.replace('/view', '/preview');
};

</script>
