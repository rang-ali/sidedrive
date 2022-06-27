<template>
  <div
    ref="menu"
    class="z-10"
    :class="menuIsCollapsed ? 'fixed left-0 top-20 bottom-20 rounded-r' : 'h-screen'"
    :style="{
      flex: `0 0 ${canCollapseMenu ? 20 : menuWidth}px`,
      width: `${canCollapseMenu ? 20 : menuWidth}px`,
    }"
  >
    <div
      :style="{
        width: `${menuWidth}px`
      }"
      :class="[
        canCollapseMenu && '-translate-x-full',
        menuIsCollapsed && 'rounded-r-md',
        menuIsCollapsed && menuHasHover && 'shadow-lg'
      ]"
      class="bg-white h-full w-full transition-transform duration-200"
    >
      <div
        :style="{
          width: `${menuWidth}px`,
        }"
        class="flex flex-col h-full"
      >
        <MenuHeader />
        <div id="listContainer" class="flex-auto overflow-auto pt-2 pb-6 pl-2.5 pr-2">
          <slot />
        </div>
        <div class="px-2 select-none">
          <MenuCreate />
          <div v-if="grantedMetadata || grantedDrive" class="text-[11px] text-gray-500 py-1.5 pb-2 px-4 cursor-default whitespace-nowrap overflow-ellipsis overflow-hidden">
            Made by 
            <a
              class="text-gray-700 font-medium dark:text-gray-700 border-b border-transparent hover:border-gray-700 hover:text-gray-700 transition-colors leading-normal cursor-pointer"
              href="https://twitter.com/rang_ali"
              target="_blank"
              tabindex="-1"
            >
              @rang_ali
            </a>
          </div>
          <div v-else class="h-4" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useMouseInElement } from '@vueuse/core'
import MenuHeader from '@/components/MenuHeader.vue';
import MenuCreate from '@/components/MenuCreate.vue';
import GIcon from '@/components/GIcon.vue';
import useStore from '@/store';

const { menuWidth, menuIsCollapsed, createFile, menuHasHover, popupIsOpen, grantedMetadata, grantedDrive } = useStore();

const canCollapseMenu = computed(() => menuIsCollapsed.value && !menuHasHover.value);

const menu = ref(null);

const { isOutside } = useMouseInElement(menu);

watch([isOutside, popupIsOpen], (val) => {
  menuHasHover.value = !val[0] || val[1];
});

</script>
