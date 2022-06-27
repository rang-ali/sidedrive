<template>
  <div
    class="
      fixed
      flex
      items-end
      justify-start
      flex-nowrap
      z-[100]
      left-4
      bottom-12
    "
  >
    <transition-group
      name="stacks"
      tag="div"
      class="relative stacks-list"
      style="
        perspective-origin: 0% 110%;
        perspective: 100px;
      "
    >
        <div
          v-for="(item, i) in toasts.slice(0, 3)"
          :key="item.id"
          class="
            flex
            card
            py-4
            pl-6
            pr-4
            font-medium
            rounded-md
            top-1/2
            left-1/2
            absolute
            leading-normal
            w-[400px]
            border
            border-white
            border-opacity-75
            text-gray-900
            text-opacity-90
            bg-gray-100
            shadow-2xl
            text-md
            duration-300
          "
          :style="[
            {
              transform: `translate3d(${i * 3}%, -${100 - i * 8}%, -${i * 10}px)`,
              zIndex: 4 - i,
            },
            i !== 0 && {
              opacity: 0.75
            }
          ]"
          @mouseenter="i === 0 ? removeDisposeTimeout() : null"
          @mouseleave="i === 0 ? setDisposeTimeout(item) : null"
        >
          <template v-if="item.reason !== 'appNotAuthorizedToFile'">
            <GIcon
              name="warning"
              size="24"
              class="w-6 flex-shrink-0 mr-4 opacity-80 text-red-500"
            />
            <div
              class="flex-auto"
              style="overflow-wrap: anywhere;"
              v-html="item.message"
            />
          </template>
          <template v-else>
            <GIcon
              name="lock"
              size="24"
              class="w-6 flex-shrink-0 mr-4 text-primary-500"
            />
            <div class="flex flex-col items-start">
              <div class="text-lg text-black">Insufficient permissions</div>
              <div class="font-normal mb-6" v-html="item.message" />
              <div
                class="
                  btn
                  bg-primary-500
                  hover:bg-primary-600
                  active:bg-primary-700
                  py-2.5
                  px-6
                  text-white
                  inline-flex
                  rounded
                  relative
                "
                @click="() => {
                  grantPermission(() => { removeDisposeTimeout(); item.dispose(); })
                }"
              >
                <svg class="rounded absolute left-1 top-1" width="32" height="32" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#fff" d="M0 0h34v34H0z"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M25.64 17.2c0-.63-.06-1.25-.16-1.84H17v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92a8.78 8.78 0 0 0 2.68-6.62Z" fill="#4285F4"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M17 26a8.6 8.6 0 0 0 5.96-2.18l-2.91-2.26a5.4 5.4 0 0 1-8.09-2.85h-3v2.33A9 9 0 0 0 17 26Z" fill="#34A853"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M11.96 18.71a5.41 5.41 0 0 1 0-3.42v-2.33h-3a9 9 0 0 0 0 8.08l3-2.33Z" fill="#FBBC05"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M17 11.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59a9 9 0 0 0-14.06 2.61l3 2.34A5.36 5.36 0 0 1 17 11.58Z" fill="#EA4335"/>
                </svg>
                <div class="pl-6">
                  Grant permission with Google
                </div>
              </div>
            </div>
          </template>
          <div
            class="
              flex-shrink-0
              w-6
              h-6
              rounded-full
              ml-6
              btn
              inline-flex
              items-center
              justify-center
              hover:bg-gray-200
              hover:bg-opacity-40
            "
            @click="() => { removeDisposeTimeout(); item.dispose(); }"
          >
            <GIcon name="close" size="14" />
          </div>
        </div>
      </transition-group>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import useStore from '@/store';
import GIcon from '@/components/GIcon.vue';

const { toasts, grantedDrive } = useStore();

const disposeTimeout = ref(null);

const setDisposeTimeout = (item) => {
  if (!item.timeout) return;
  disposeTimeout.value = setTimeout(() => {
    item.dispose();
  }, item.timeout);
}

const removeDisposeTimeout = () => {
  clearTimeout(disposeTimeout.value);
  disposeTimeout.value = null;
}

watch(toasts, (val) => {
  if (!val.length) return;
  removeDisposeTimeout();
  setDisposeTimeout(val[0]);
});


const grantPermission = async (callback) => {
  const GoogleAuth = gapi.auth2.getAuthInstance();
  const user = GoogleAuth.currentUser.get();
  try {
    if (!user.hasGrantedScopes('https://www.googleapis.com/auth/drive')) {
      const options = new gapi.auth2.SigninOptionsBuilder({
        scope: 'https://www.googleapis.com/auth/drive',
      });
      await user.grant(options);
    }
    callback();
    // TODO Clear all sign in toasts permissions on success
  } catch (error) {
    if (error?.error) {
      const message = error.error === 'popup_closed_by_user' ? 'Popup closed by user' : error.error;
      addToast({ message });
    }
  } finally {
    grantedDrive.value = user.hasGrantedScopes('https://www.googleapis.com/auth/drive');
  }
}
</script>

<style lang="scss">

.stacks-enter-active {
  transition: 0.35s !important;
}
.stacks-enter-from {
  opacity: 0 !important;
  transform: translate3d(-50%, -100%, -1px) !important;
  &:nth-child(2) {
    transform: translate3d(-50%, -88%, -10px) !important;
  }
  &:nth-child(3) {
    transform: translate3d(-50%, -84%, -20px) !important;
  }
}
.stacks-list .stacks-leave-to {
  opacity: 0 !important;
  &:first-child {
    z-index: 150;
    transform: translate3d(-100%, -100%, 1px) !important;
  }
}
.stacks-leave-active {
  transition: 0.35s !important;
}
</style>
