<template>
  <Popup
    ref="popup"
    transition="scale"
    position="bottom-left"
    :y-offset="-44"
    :overlay="true"
    :custom="true"
    @toggle="showSignIn = false"
  >
    <template #default="{ close }">
      <div
        class="
          w-[400px]
          rounded-lg
          overflow-hidden
          bg-white
          border
          border-gray-200
          shadow-2xl
        "
      >
        <div
          class="bg-gradient-to-br pl-8 pt-8 pr-8 pb-14 border-b border-gray-200 border-opacity-50"
          style="--tw-gradient-stops: hsl(0, 0%, 100%) 50%, hsl(0, 0%, 93%);"
        >
          <div class="text-2xl text-gray-900 font-medium mb-2 text-center">Sign in</div>
          <div class="text-black text-opacity-70 max-w-[35ch] text-center mx-auto">
            Although Sidedrive runs only on your browser, we do respect any remaining concerns about privacy.
            <!-- That’s why we offer you the option to choose between two permission scopes. -->
            That's why we let you decide which permission scope you want to grant.
          </div>
        </div>
        <div class="bg-white pb-14 pl-12 pr-12 flex flex-col items-center">
          <div
            class="
              flex
              bg-gray-100
              border
              border-gray-200
              border-opacity-60
              p-[2px]
              rounded-lg
              w-64
              mx-auto
              -translate-y-1/2
              text-sm
              relative
            "
          >
            <div
              :class="activeTab === 0 ? '-translate-x-1/2' : 'translate-x-1/2'"
              :style="{
                transform: `translate3d(${activeTab === 0 ? 'calc(-50% + 1px)' : 'calc(50% - 1px)'}, 0, 0)`,
              }"
              class="top-px bottom-0.5 w-1/2 left-1/4 transition-transform rounded-md bg-white absolute ease-out"
              style="box-shadow: 0 2px 2px rgba(0,0,0,0.2), 0 0 1px rgba(0,0,0,0.2);"
            />
            <div
              v-for="(opt, i) in ['Light Features', 'All Features']"
              :key="opt"
              :class="activeTab === i ? 'text-black' : 'text-gray-500'"
              class="flex-auto w-1/2 text-center py-1 relative cursor-pointer hover:text-black transition-colors select-none"
              @click="activeTab = i"
            >
              {{ opt }}
            </div>
          </div>
          <div class="py-2 text-md">
            <div
              v-for="feature in [
                { label: 'You can view your folder structure', can: true },
                { label: 'You can edit all file attributes', can: activeTab === 1 },
                { label: 'Move files with drag & drop', can: activeTab === 1 },
                { label: 'Create files and folders', can: activeTab === 1 },
              ]"
              :key="feature.label"
              class="flex items-center h-7 relative"
            >
              <transition
                enter-active-class="transition-all duration-75"
                enter-from-class="opacity-0 scale-50"
                enter-to-class="opacity-1"
                leave-active-class="transition-all duration-75"
                leave-class="opacity-1"
                leave-to-class="opacity-0 scale-50"
              >
                <GIcon
                  :name="feature.can ? 'check' : 'close'"
                  :class="feature.can ? 'text-green-500' : 'text-red-500'"
                  :key="feature.label + feature.can"
                  size="14"
                  stroke-width="2"
                  stroke="currentColor"
                  class="absolute -left-6 top-2 mr-2 transform"
                />
              </transition>
              <div :class="!feature.can && 'line-through text-gray-600'" class="transition-colors">
                {{ feature.label }}
              </div>
            </div>
          </div>
          <div class="border border-gray-200 border-opacity-70 px-4 py-2 flex flex-col rounded-md mt-4 w-full">
            <div class="text-xs flex items-center leading-none pb-1 -ml-0.5">
              <GIcon name="lock" size="16" class="text-primary flex-shrink-0 mr-1" />
              <div class="text-primary font-semibold">
                Necessary permission for functionality
              </div>
            </div>
            <div>
              <div class="text-[14px]">
                {{ activeTab === 0
                  ? 'View and manage metadata of your files.' : 'Create, view & edit file data.'
                }}
              </div>
              <transition
                enter-active-class="transition-all duration-100 ease-out"
                leave-active-class="transition-all duration-100 ease-out"
                enter-from-class="h-0 opacity-0"
                enter-to-class="h-4"
                leave-to-class="h-0 opacity-0"
                leave-from-class="h-4"
              >
                <div v-if="activeTab === 0" :key="'text' + activeTab" class="text-[13px] text-gray-700 overflow-hidden">
                  Metadata <span class="underline text-gray-800">does not</span> include file contents.
                </div>
              </transition>
            </div>
          </div>
          
          <div
            class="btn w-full relative flex center justify-center bg-white text-white p-1 text-center rounded-md shadow-md font-medium hover:ring active:ring-1 transition h-[46px] items-center mt-12"
            style="background-color: #4285F4;"
            @click="() => login(close)"
          >
            <svg class="rounded absolute left-1.5 top-1.5" width="36" height="36" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill="#fff" d="M0 0h34v34H0z"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M25.64 17.2c0-.63-.06-1.25-.16-1.84H17v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92a8.78 8.78 0 0 0 2.68-6.62Z" fill="#4285F4"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M17 26a8.6 8.6 0 0 0 5.96-2.18l-2.91-2.26a5.4 5.4 0 0 1-8.09-2.85h-3v2.33A9 9 0 0 0 17 26Z" fill="#34A853"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M11.96 18.71a5.41 5.41 0 0 1 0-3.42v-2.33h-3a9 9 0 0 0 0 8.08l3-2.33Z" fill="#FBBC05"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M17 11.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59a9 9 0 0 0-14.06 2.61l3 2.34A5.36 5.36 0 0 1 17 11.58Z" fill="#EA4335"/>
            </svg>
            <svg class="ml-5" height="15" viewBox="0 0 112 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.77 7.62c0-.4-.14-.72-.43-.94a5.1 5.1 0 0 0-1.54-.67 7.46 7.46 0 0 1-1.78-.75C1.18 4.74.76 4.05.76 3.2c0-.75.3-1.36.9-1.85A3.7 3.7 0 0 1 4.03.63 4 4 0 0 1 5.75 1c.5.23.9.57 1.19 1.01.29.44.43.92.43 1.46h-1.6c0-.49-.15-.86-.46-1.13-.3-.28-.73-.42-1.3-.42-.52 0-.93.12-1.22.34-.28.22-.43.54-.43.94 0 .34.16.62.47.85.31.22.83.44 1.55.66.72.21 1.3.45 1.73.73.44.27.76.58.96.94.2.35.3.76.3 1.24a2.2 2.2 0 0 1-.88 1.84c-.6.45-1.4.68-2.4.68-.67 0-1.29-.13-1.85-.37-.56-.25-1-.6-1.3-1.03a2.5 2.5 0 0 1-.47-1.52h1.6c0 .52.18.93.53 1.22.34.28.84.43 1.49.43.56 0 .98-.11 1.25-.34.29-.23.43-.53.43-.9ZM10.28 10H8.73V3.13h1.55V10ZM8.64 1.35c0-.24.07-.44.22-.6.15-.15.37-.23.65-.23s.5.08.65.24a.8.8 0 0 1 .22.59.8.8 0 0 1-.22.58c-.16.15-.37.23-.65.23s-.5-.08-.65-.23a.82.82 0 0 1-.22-.58Zm3.06 5.17c0-1.07.24-1.92.74-2.56.5-.64 1.17-.96 2-.96.78 0 1.4.28 1.85.82l.07-.69h1.39V9.8c0 .9-.28 1.61-.85 2.13a3.2 3.2 0 0 1-2.26.78c-.5 0-1-.1-1.48-.31a2.6 2.6 0 0 1-1.1-.82l.74-.93a2.2 2.2 0 0 0 1.75.85c.51 0 .91-.14 1.21-.42.3-.28.45-.68.45-1.22v-.47c-.45.5-1.04.75-1.78.75-.8 0-1.46-.32-1.98-.96a4.16 4.16 0 0 1-.76-2.65Zm1.53.13c0 .69.14 1.23.42 1.63.28.4.67.59 1.17.59a1.5 1.5 0 0 0 1.39-.8V5.05c-.3-.52-.75-.78-1.38-.78-.5 0-.9.2-1.18.6-.28.4-.42 1-.42 1.78Zm7.54-3.52.04.8a2.47 2.47 0 0 1 2-.93c1.43 0 2.16.82 2.19 2.46V10h-1.55V5.55c0-.44-.1-.76-.28-.96-.19-.22-.5-.32-.92-.32a1.5 1.5 0 0 0-1.4.84V10h-1.53V3.13h1.45ZM31.45 10h-1.54V3.13h1.54V10Zm-1.64-8.65c0-.24.08-.44.23-.6a.88.88 0 0 1 .64-.23c.28 0 .5.08.65.24a.8.8 0 0 1 .23.59.8.8 0 0 1-.23.58.89.89 0 0 1-.65.23c-.27 0-.5-.08-.64-.23a.82.82 0 0 1-.23-.58Zm4.76 1.78.04.8a2.47 2.47 0 0 1 2-.93c1.43 0 2.16.82 2.19 2.46V10h-1.55V5.55c0-.44-.1-.76-.28-.96-.19-.22-.5-.32-.92-.32a1.5 1.5 0 0 0-1.4.84V10h-1.53V3.13h1.45Zm15.08 4.74 1.09-4.74h1.5L50.37 10H49.1l-1.47-4.72L46.18 10H44.9l-1.88-6.87h1.5l1.12 4.7 1.4-4.7h1.17l1.43 4.74ZM54.91 10h-1.54V3.13h1.54V10Zm-1.63-8.65c0-.24.07-.44.22-.6a.89.89 0 0 1 .65-.23c.27 0 .5.08.64.24.16.15.23.35.23.59a.8.8 0 0 1-.23.58.88.88 0 0 1-.64.23.89.89 0 0 1-.65-.23.82.82 0 0 1-.22-.58Zm5.25.11v1.67h1.21v1.14h-1.2v3.84c0 .26.04.45.14.57.11.11.3.17.56.17.18 0 .36-.02.54-.06v1.2c-.35.09-.69.14-1.01.14-1.19 0-1.78-.66-1.78-1.96v-3.9h-1.13V3.13h1.13V1.46h1.54Zm3.92 2.42c.5-.58 1.14-.88 1.9-.88 1.47 0 2.22.84 2.24 2.51V10h-1.55V5.57c0-.47-.1-.8-.3-1-.21-.2-.51-.3-.9-.3a1.5 1.5 0 0 0-1.4.82V10h-1.53V.25h1.54v3.63ZM78.62 8.8c-.33.44-.8.77-1.39 1-.6.21-1.26.33-2.02.33-.77 0-1.46-.18-2.05-.53a3.53 3.53 0 0 1-1.39-1.5 5.33 5.33 0 0 1-.5-2.3v-.72c0-1.4.34-2.49 1-3.27a3.47 3.47 0 0 1 2.8-1.18c1.03 0 1.85.25 2.45.76.6.51.97 1.24 1.1 2.2h-1.58c-.18-1.11-.82-1.67-1.93-1.67a1.9 1.9 0 0 0-1.65.78 3.97 3.97 0 0 0-.58 2.28v.71c0 1 .21 1.78.63 2.33a2.1 2.1 0 0 0 1.76.82c.82 0 1.4-.18 1.75-.55V6.48h-1.9V5.26h3.5V8.8Zm1.33-2.3c0-.67.13-1.28.4-1.81a2.9 2.9 0 0 1 1.12-1.25A3.18 3.18 0 0 1 83.14 3c.92 0 1.67.3 2.25.9.58.6.9 1.39.94 2.37v.37c0 .67-.13 1.28-.39 1.81s-.63.95-1.12 1.24c-.48.3-1.04.44-1.67.44a3 3 0 0 1-2.33-.97 3.73 3.73 0 0 1-.87-2.58V6.5Zm1.54.14c0 .7.15 1.26.44 1.66.3.4.7.6 1.22.6s.92-.2 1.21-.61a3 3 0 0 0 .44-1.79c0-.7-.15-1.24-.45-1.65-.3-.4-.7-.6-1.21-.6-.5 0-.9.2-1.2.6-.3.4-.45.99-.45 1.79Zm5.86-.14c0-.67.13-1.28.4-1.81a2.9 2.9 0 0 1 1.12-1.25A3.2 3.2 0 0 1 90.54 3c.92 0 1.67.3 2.25.9.58.6.9 1.39.94 2.37v.37c0 .67-.13 1.28-.39 1.81a2.91 2.91 0 0 1-2.79 1.68 3 3 0 0 1-2.33-.97 3.73 3.73 0 0 1-.87-2.58V6.5Zm1.54.14c0 .7.15 1.26.44 1.66.3.4.7.6 1.22.6s.92-.2 1.21-.61a3 3 0 0 0 .44-1.79c0-.7-.15-1.24-.45-1.65-.3-.4-.7-.6-1.21-.6-.5 0-.9.2-1.2.6-.3.4-.45.99-.45 1.79Zm5.88-.12c0-1.07.25-1.92.75-2.56.5-.64 1.17-.96 2-.96.78 0 1.4.28 1.85.82l.07-.69h1.39V9.8c0 .9-.28 1.61-.85 2.13a3.2 3.2 0 0 1-2.26.78c-.5 0-1-.1-1.48-.31a2.6 2.6 0 0 1-1.1-.82l.73-.93a2.2 2.2 0 0 0 1.76.85c.5 0 .91-.14 1.2-.42.3-.28.45-.68.45-1.22v-.47c-.44.5-1.03.75-1.77.75-.8 0-1.47-.32-1.98-.96a4.16 4.16 0 0 1-.76-2.65Zm1.54.13c0 .69.14 1.23.42 1.63.28.4.67.59 1.17.59.62 0 1.08-.27 1.38-.8V5.05a1.46 1.46 0 0 0-1.37-.78c-.5 0-.9.2-1.18.6-.28.4-.42 1-.42 1.78Zm7.75 3.35h-1.55V.25h1.55V10Zm4.71.13a3.2 3.2 0 0 1-2.38-.92 3.4 3.4 0 0 1-.91-2.47v-.19a4 4 0 0 1 .4-1.83A2.94 2.94 0 0 1 108.6 3c.93 0 1.65.3 2.15.89.52.6.77 1.44.77 2.53v.62h-4.49c.05.57.24 1.02.57 1.35.33.33.75.5 1.26.5.7 0 1.28-.29 1.72-.86l.83.8a2.8 2.8 0 0 1-1.1.95c-.46.22-.97.34-1.54.34Zm-.19-5.89c-.42 0-.76.15-1.02.45-.26.3-.43.7-.5 1.23H110v-.1a1.85 1.85 0 0 0-.41-1.18c-.25-.26-.58-.4-1-.4Z" fill="#fff" />
            </svg>
          </div>
          <div class="text-center text-sm mt-4 text-gray-900">
            We don't under any circumstances read, use, store nor share your file data in any way.
          </div>
          <div class="pt-3 text-gray-600 text-[13px] text-center">
            Read our <a href="/privacy-policy.pdf" target="_blank" class="text-primary hover:underline cursor-pointer font-medium">Privacy Policy</a> for more details.
          </div>
        </div>
      </div>
    </template>
  </Popup>
</template>
<script setup>
import Popup from '@/components/Popup.vue';
import GIcon from '@/components/GIcon.vue';
import useStore from '@/store';
import { onMounted, ref, watch } from 'vue';

const { addToast, showSignIn } = useStore();

const popup = ref(null);

watch(showSignIn, (val) => {
  if (!val) return;
  popup.value.show({ element: document.getElementById('signin-button') });
})

// if (!user.hasGrantedScopes('https://www.googleapis.com/auth/drive.metadata')) {
// }
const login = async (callback) => {
  const GoogleAuth = gapi.auth2.getAuthInstance();
  const user = GoogleAuth.currentUser.get();
  const scope = activeTab.value === 0 ? 'https://www.googleapis.com/auth/drive.metadata' : 'https://www.googleapis.com/auth/drive';

  try {
    const options = new gapi.auth2.SigninOptionsBuilder({
      scope,
    });
    await user.grant(options);
    callback();
  } catch (error) {
    if (error?.error) {
      let message = error.error;
      if (error.error === 'popup_closed_by_user') {
        message = `
          <div>
            If you are having difficulties signing in make sure you are not blocking Third-Party Cookies.
          </div>
          <div class="py-4">
            <a
              href="https://support.google.com/chrome/answer/95647?hl=en&co=GENIE.Platform%3DDesktop#zippy=%2Callow-or-block-cookies"
              target="_blank"
            >
              Instructions for
              <span class="underline text-primary-500 dark:text-primary-500 hover:text-primary-500 transition-colors">Google Chrome</span>.
            </a>
          </div>
        `
      }
      addToast({ message });
    }
  }
}

const activeTab = ref(0);

</script>