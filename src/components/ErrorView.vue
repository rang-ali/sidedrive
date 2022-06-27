<template>
  <div
    class="grid- place-items-center text-center pt-14 pb-8 w-full h-full overflow-auto bg-gray-150"
  >
    <div class="flex flex-col items-center justify-center w-full min-h-full">
      <img
        src="/grant-permission.png"
        alt="Grant Sidedrive permissions"
        class="w-auto h-[350px] mb-10 select-none"
      >
      <div class="text-2xl font-semibold mb-1">
        insufficient permissions
      </div>
      <div class="w-[44ch] text-gray-700 leading-relaxed pb-10">
        You need to grant Sidedrive permissions for it to work.
        <br>
        Please sign in again and check a permission box.
      </div>
      <div
        class="
          btn
          bg-primary-500
          hover:bg-primary-600
          active:ring-4
          active:ring-primary-200
          active:bg-primary-700
          text-white
          ring-0
          transition-all
          py-3
          px-10
          font-medium
          shadow-lg
          rounded-md
          mb-5
        "
        @click="showSignIn = true"
      >
        Sign in again
      </div>
      <div class="text-sm w-[48ch] text-gray-800">
        We don't read, store nor share your file data.
        <br>
        Read our <a href="/privacy-policy.pdf" target="_blank" class="text-primary font-medium hover:underline cursor-pointer">Privacy Policy</a> for more details.
      </div>
      <div class="flex items-center justify-center flex-col mt-20">
        <img src="/logo-horizontal.svg" class="h-[38px] mb-1 w-auto">
        <div class="opacity-80 text-xs">
          A better Google Drive experience.
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import useStore from '@/store';
const { insufficientPermissions, showSignIn } = useStore();

setInterval(() => {
  const authResponse = window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse();
  const authedScopes = authResponse.scope.split(' ');
  const scopeDrive = 'https://www.googleapis.com/auth/drive';
  const scopeMeta = 'https://www.googleapis.com/auth/drive.metadata';

  if (insufficientPermissions.value && (authedScopes.includes(scopeDrive) || authedScopes.includes(scopeMeta))) {
    window.location.reload();
  }
}, 1000);

</script>
