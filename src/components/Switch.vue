<template>
  <button
    :class="modelValue ? 'bg-primary-500' : 'bg-gray-300'"
    role="switch"
    tabindex="0"
    type="button"
    class="relative inline-flex flex-shrink-0 h-[14px] w-[28px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-200 focus-visible:ring-opacity-70"
    bg-primary-500
    @click="emit('update:modelValue', !modelValue)"
  >
    <span
      :class="modelValue ? 'translate-x-[14px]' : 'translate-x-0'"
      class="pointer-events-none inline-block h-[10px] w-[10px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-100"
    />
  </button>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);
</script>
