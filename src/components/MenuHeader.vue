<template>
  <div class="px-2 py-3 flex items-center">
    <div
      v-if="!isSignedIn"
      id="signin-button"
      class="
        shadow-md
        mx-1
        border
        border-gray-200
        border-opacity-40
        relative
        flex-1
        flex
        p-2
        text-gray-700
        font-medium
        items-center
        btn
        select-none
        min-w-0
        rounded-[7px]
      "
      @click="showSignIn = true"
    >
      <div class="relative w-7 h-7">
        <transition
          leave-active-class="transition duration-200"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div v-if="isLoading" class="absolute inset-0">
            <svg class="spinner" viewBox="0 0 50 50">
              <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="2.5"></circle>
            </svg>
          </div>
        </transition>
        <GIcon name="avatar" class="w-full h-full text-secondary-400 absolute inset-0"  />
      </div>
      <div class="pl-2 truncate overflow-ellipsis flex-1">
        Sign in
      </div>
    </div>
    <Popup
      v-else
      transition="scale"
      position="bottom-left"
      :y-offset="0"
    >
      <template #trigger="{ isOpen }">
        <div
          id="signin-button"
          :class="{
            'bg-gray-100': isOpen,
          }"
          class="
            relative
            flex-1
            flex
            p-2
            text-gray-700
            font-medium
            items-center
            btn
            select-none
            min-w-0
            mx-1
            rounded-[5px]
          "
        >
          <div class="relative w-7 h-7">
            <transition
              leave-active-class="transition duration-200"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <div v-if="isLoading" class="absolute inset-0">
                <svg class="spinner" viewBox="0 0 50 50">
                  <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="2.5"></circle>
                </svg>
              </div>
            </transition>
            <GIcon name="avatar" class="w-full h-full text-secondary-400 absolute inset-0"  />
            <div
              v-if="user?.photoLink"
              :style="{ backgroundImage: `url(${user.photoLink})` }" 
              class="w-full h-full rounded-full overflow-hidden absolute inset-0 border-none bg-center bg-cover bg-no-repeat"
            />
          </div>
          <div
            :class="{ 'text-gray-800': !!user.displayName }"
            class="pl-2 truncate overflow-ellipsis flex-1"
          >
            {{ user.displayName || 'Unknown User' }}
          </div>
        </div>
      </template>
      <template #default="{ close }">
        <div
          class="rounded-lg shadow-2xl bg-white border border-gray-200 overflow-hidden cursor-default"
        >
          <template v-if="user">
            <div class="p-6">
              <div class="text-xl font-medium pb-1">
                Hi {{ user.firstName }}
              </div>
              <div class="pr-6 text-gray-800 pb-0.5">
                You are currently signed in as
              </div>
              <div class="text-primary font-medium truncate overflow-ellipsis">
                {{ user.emailAddress }}
              </div>
              <!-- <div class="text-gray-900 leading-snug text-lg truncate overflow-ellipsis">
                {{ user.displayName }}
              </div> -->
              <div
                class="
                  group
                  cursor-pointer
                  py-2
                  pl-4
                  pr-7
                  inline-flex
                  items-center
                  rounded-md
                  border
                  text-gray-800
                  border-gray-200
                  border-opacity-20
                  bg-gray-100
                  hover:bg-gray-200
                  hover:bg-opacity-40
                  hover:text-black
                  active:bg-opacity-60
                  transition-colors
                  mt-10
                  btn
                "
                @click="() => close(logout)"
              >
                <GIcon name="logout" size="18" class="text-gray-400 mr-4 group-hover:text-gray-700 transition-colors" />
                <div>{{ 'Logout' }}</div>
              </div>
              <div class="pt-3 text-gray-500 text-sm transition-colors">
                <a
                  href="https://twitter.com/messages/compose?recipient_id=198344339&text=Hey!%20Some%20feedback%20for%20Sidedrive"
                  target="_blank"
                  class="underline cursor-pointer hover:text-gray-700 transition-colors"
                >
                  Share feedback
                </a>
                &nbsp;&middot;&nbsp;
                <a
                  href="/privacy-policy.pdf"
                  target="_blank"
                  class="hover:underline cursor-pointer hover:text-gray-700 transition-colors"
                >
                  Privacy Policy
                </a>
              </div>
            </div>
          </template>
        </div>
      </template>
    </Popup>
    <transition
      v-if="isSignedIn"
      enter-active-class="transition"
      leave-active-class="transition"
      enter-from-class="opacity-0"
      enter-to-class="opacity-1"
      leave-class="opacity-1"
      leave-to-class="opacity-0"
    >
      <div v-show="menuHasHover || popupIsOpen" class="flex items-center">
        <Popup transition="scale-sm" position="bottom-left" @toggle="popupIsOpen = $event">
          <template #trigger="{ isOpen }">
            <div
              :class="{ 'bg-gray-100': isOpen }"
              v-tippy="{
                content: 'Show settings',
                placement: 'bottom',
              }"
              class="p-2 btn rounded leading-none text-gray-400 hover:text-gray-500"
            >
              <GIcon name="cog" size="24" class="leading-none" />
            </div>
          </template>
          <div
            class="w-60 shadow-xl bg-white border border-gray-200 rounded-md overflow-hidden p-3"
          >
            <div
              v-for="(opt, i) in [
                { label: 'Show file tooltips', key: 'showFileTooltip' },
                { label: 'Use pointer cursors', key: 'usePointerCursor' },
              ]"
              :key="i"
              class="flex text-gray-800 btn rounded"
              @click="() => useStore()[opt.key].value = useStore()[opt.key].value ? false : true"
            >
              <div class="flex-auto px-2 py-1 select-none">{{ opt.label }}</div>
              <div class="py-1 pr-2"><Switch :modelValue="useStore()[opt.key].value" /></div>
              {{ opt.value }}
            </div>
          </div>
        </Popup>
        <div
          v-tippy="{
            content: menuIsCollapsed ? `Lock sidebar open` : `Hide sidebar`,
            placement: 'bottom',
          }"
          class="p-2 btn rounded leading-none text-gray-400 hover:text-gray-500"
          @click="menuIsCollapsed = !menuIsCollapsed"
        >
          <GIcon
            :style="menuIsCollapsed && { transform: 'rotateY(180deg)' }"
            name="chevronsLeft"
            size="24"
            class="leading-none"
          />
        </div>
      </div>
    </transition>
  </div>
  <component v-if="!usePointerCursor" :is="'style'">
    .cursor-pointer.cursor-pointer,
    .btn.btn {
      cursor: default;
    }
  </component>
</template>

<script setup>
import { defineProps, ref } from 'vue';
import useStore from '@/store';
import Switch from '@/components/Switch.vue';
import Popup from '@/components/Popup.vue';
import GIcon from '@/components/GIcon.vue';

const {
  user,
  menuIsCollapsed,
  logout,
  usePointerCursor,
  menuHasHover,
  isLoading,
  showSignIn,
  isSignedIn,
} = useStore();

const popupIsOpen = ref(false);

</script>
<style lang="scss">
$offset: 7px;
.spinner {
  animation: rotate 2s linear infinite;
  z-index: 2;
  position: absolute;
  top: #{-1 * $offset};
  left: #{-1 * $offset};
  width: calc(100% + #{$offset * 2});
  height: calc(100% + #{$offset * 2});
  & .path {
    stroke: hsl(217, 77%, 59%);
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
  }
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}
</style>