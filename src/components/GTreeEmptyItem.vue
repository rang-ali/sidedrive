<template>
  <div
    class="grid grid-rows-1 items-center text-md"
    style="
      grid-template-columns: 20px 20px 1fr 20px;
      grid-template-rows: 28px;
      border-radius: 5px;
    "
  >
    <div />
    <div class="item-icon self-center">
      <GIcon
        v-if="loading"
        name="spinner"
        class="animate-spin text-gray-400"
        size="14"
      />
    </div>
    <div
      class="truncate overflow-ellipsis w-full pl-1.5 text-gray-500"
      style="line-height: 28px;"
    >
      {{ loading ? 'Loading' : 'No files inside'}}
    </div>
    <div />
  </div>
</template>

<script setup>
import GIcon from '@/components/GIcon.vue';
import { defineProps } from 'vue';

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
});

</script>
