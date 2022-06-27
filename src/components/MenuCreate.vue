<template>
  <div
    ref="trigger"
    v-tippy="{
      content: isSignedIn ? null : 'Sign in to be able to create files',
      placement: 'top',
    }"
    :class="[
      isOpen ? 'bg-gray-200 bg-opacity-60' : 'bg-gray-150 bg-opacity-80',
      { '!cursor-not-allowed': !isSignedIn }
    ]"
    class="
      btn
      px-5
      py-4
      leading-none
      mt-1
      text-gray-600
      flex
      hover:bg-gray-200
      hover:bg-opacity-60
      hover:text-gray-700
      active:bg-gray-200
      items-center
      border
      border-gray-200
      border-opacity-20
      rounded-lg
      select-none
      transition
      duration-75
      group
    "
    @click="isSignedIn ? onOpen() : null"
  >
    <GIcon class="text-gray-400 group-hover:text-gray-600 transition-colors" size="22" name="roundPlus" />
    <div class="pl-2 font-medium transition-colors">New file</div>
  </div>
  <FileCreate
    ref="createMenu"
    transition="scale"
    v-model:open="isOpen"
  />
</template>
<script setup>
import { ref } from 'vue';
import GIcon from '@/components/GIcon.vue';
import FileCreate from '@/components/FileCreate.vue';
import useStore from '@/store';

const { createFile, isSignedIn } = useStore();

const trigger = ref(null);
const createMenu = ref(null);
const isOpen = ref(false);

const onOpen = () => {
  isOpen.value = true;
  createMenu.value.show({ element: trigger.value })
};

</script>