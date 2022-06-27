<template>
  <div
    v-if="showSearch"
    class="fixed inset-0 z-50 bg-black bg-opacity-20 w-full h-full"
    style="perspective: 1500px;"
    @click.self="showSearch = false"
  >
    <transition
      enter-active-class="transition-all"
      enter-from-class="opacity-0 scale-[97.5%]"
      enter-to-class="opacity-1"
      leave-active-class="transition-all"
      leave-class="opacity-1"
      leave-to-class="opacity-0 scale-[97.5%]"
      @enter="() => input.focus()"
      appear
    >
      <div
        id="omnibar"
        class="
          fixed
          top-[18%]
          left-1/2
          w-[710px]
          border
          border-gray-300
          p-2
          bg-white
          rounded-xl
          -translate-x-1/2
          shadow-2xl
        "
      >
        <div class="relative">
          <div
            class="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-gray-400
              w-[28px]
              h-[28px]
              flex
              items-center
              justify-center
            "
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
                v-if="isLoading"
                name="spinner"
                size="22"
                class="animate-spin absolute left-[3px] top-[3px]"
              />
              <GIcon
                v-else
                name="search"
                size="28"
                class="absolute left-0 top-0"
              />
            </transition>
          </div>
          <input
            ref="input"
            type="text"
            class="
              outline-none
              block
              w-full
              text-xl
              pl-14
              py-4
              bg-transparent
            "
            v-model="query"
            placeholder="Search for a file"
          >
        </div>
        <div
          :class="list.length ? 'h-[430px] border-gray-200 border-opacity-50 pt-2' : 'h-0 border-transparent'"
          class="grid grid-cols-12 overflow-hidden border-t transition-height duration-100 ease-out"
        >
          <div id="search-list" class="h-full overflow-auto col-span-5 pr-4 pt-2">
            <div
              v-for="(item, i) in list"
              :key="item.id"
              :class="[
                selectedIndex === i ? 'bg-gray-200 bg-opacity-40 text-black' : 'text-gray-900'
              ]"
              class="flex items-center px-4 h-[32px] rounded-md cursor-pointer select-none active:bg-gray-200 active:bg-opacity-100"
              @mousemove.passive="selectedIndex = i"
              @click="() => onSelectFile(item)"
            >
              <img
                :src="item.iconLink.replace('https://drive-thirdparty.googleusercontent.com/16/', 'https://drive-thirdparty.googleusercontent.com/32/')"
                width="16"
                height="16"
              >
              <div
                class="
                  truncate
                  overflow-ellipsis
                  w-full
                  pl-4
                  text-opacity-70
                "
              >
                {{ item.name }}
              </div>
            </div>
            <div
              v-if="fetchMore"
              class="
                btn
                flex
                items-center
                px-4
                h-[32px]
                rounded-md
                select-none
                text-gray-600
                mt-5
                mb-5
                justify-center
                text-md
                font-medium
                hover:bg-gray-100
                active:bg-gray-200
                active:bg-opacity-60
              "
              @click="() => onFetchMore(fetchMore)"
            >
              <GIcon :class="isLoading && 'animate-spin'" name="loadMore" size="16" />
              <div class="pl-2">
                Load more results
              </div>
            </div>
          </div>
          <div class="h-full overflow-auto col-span-7 p-6 border-l border-gray-200 border-opacity-70">
            <div v-if="selectedFile">
              <div class="flex">
                <div class="w-32 h-40 overflow-hidden border border-gray-200 rounded border-opacity-60 mr-5 flex-shrink-0 relative">
                  <div class="inset-0 absolute bg-gray-200 bg-opacity-50 skeleton-box z-[-1]" />
                  <img
                    v-if="selectedFile.hasThumbnail"
                    :key="selectedFile.id"
                    :src="isSafari()
                      ? selectedFile.thumbnailLink
                      : `https://drive.google.com/thumbnail?authuser=${authUser}&sz=w220-h400&id=${selectedFile.id}`
                    "
                    referrerPolicy="no-referrer"
                    class="w-full h-auto"
                    alt=""
                  >
                  <div
                    v-else
                    class="w-full h-full flex flex-col items-center justify-center text-gray-500 text-center"
                  >
                    <GIcon class="text-gray-200" name="image" size="32" />
                    <div class="text-sm pt-1 leading-tight">Preview<br>unavailable</div>
                  </div>
                </div>
                <div>
                  <div class="font-semibold" style="overflow-wrap: anywhere;">
                    {{ selectedFile.name }}
                  </div>
                  <div class="flex items-center">
                    <GIcon
                      v-if="selectedFile.starred"
                      class="mr-2 text-gray-500"
                      name="star2"
                      size="18"
                    />
                    <div class="text-gray-600 text-md">
                      {{ selectedFile.shared ? 'Shared' : 'Private' }}
                    </div>
                  </div>
                  <div
                    class="
                      btn
                      py-0.5
                      pr-[2px]
                      pl-2
                      text-[13px]
                      text-opacity-90
                      font-medium
                      text-white
                      bg-primary-500
                      hover:bg-primary-600
                      active:bg-primary-700
                      inline-flex
                      items-center
                      leading-none
                      rounded-[3px]
                      mt-5
                    "
                    @click="onSelectFile(selectedFile)"
                  >
                    <div>Open</div>
                    <div class="inline-flex w-5 h-5 bg-black bg-opacity-10 items-center justify-center rounded-sm ml-2">
                      <GIcon name="enter" size="10" class="opacity-80" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-2 text-sm p-1.5 border-opacity-50 mt-4">
                <div class="text-gray-600">
                  Created
                </div>
                <div class="text-sm">
                  <div>{{ parseDate(selectedFile.createdTime) }}</div>
                  <div
                    v-if="selectedFile.createdTime && timeAgo(selectedFile.createdTime, { nullIfCutoff: true })"
                    class="text-gray-600"
                  >
                    {{ timeAgo(selectedFile.createdTime) }}
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-2 text-sm p-1.5 border-t border-gray-200 border-opacity-50">
                <div class="text-gray-600">
                  Last viewed
                </div>
                <div class="text-sm">
                  <div>{{ selectedFile.viewedByMeTime ? parseDate(selectedFile.viewedByMeTime) : 'Not viewed yet' }}</div>
                  <div
                    v-if="selectedFile.viewedByMeTime && timeAgo(selectedFile.viewedByMeTime, { nullIfCutoff: true })"
                    class="text-gray-600"
                  >
                    {{ timeAgo(selectedFile.viewedByMeTime) }}
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-2 text-sm p-1.5 border-t border-gray-200 border-opacity-50">
                <div class="text-gray-600">
                  Last modified
                </div>
                <div class="text-sm">
                  <div>{{ parseDate(selectedFile.modifiedTime) }}</div>
                  <div>by
                    <a
                      v-if="selectedFile.lastModifyingUser?.emailAddress"
                      :href="`mailto:${selectedFile.lastModifyingUser?.emailAddress}`"
                      class="cursor-pointer"
                    >
                      {{ selectedFile.lastModifyingUser?.displayName }}
                    </a>
                    <span v-else class="opacity-50">Unknown user</span>
                  </div>
                  <div
                    v-if="selectedFile.modifiedTime && timeAgo(selectedFile.modifiedTime, { nullIfCutoff: true })"
                    class="text-gray-600"
                  >
                    {{ timeAgo(selectedFile.modifiedTime) }}
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-2 text-sm p-1.5 border-t border-gray-200 border-opacity-50">
                <div class="text-gray-600">
                  Link
                </div>
                <div class="text-sm">
                  <div>
                    <a :href="selectedFile.webViewLink" target="_blank" class="text-primary cursor-pointer font-medium">
                      Open in new tab
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, nextTick, computed, onMounted } from 'vue';
import useStore from '@/store';
import { timeAgo, isSafari } from '@/utils';
import GIcon from '@/components/GIcon.vue';
import { debouncedWatch, onKeyStroke } from '@vueuse/core';

const { fetchFiles, isLoading, selectFile, files, showSearch, authUser, toasts } = useStore();
const query = ref(null);
const input = ref(null);
const list = ref([]);
const selectedIndex = ref(null);
const fetchMore = ref(null);

const selectedFile = computed(() => {
  const listHasLength = !!list.value?.length;
  const hasSelected = selectedIndex.value > -1;
  if (!(listHasLength && hasSelected)) return null;

  return list.value[selectedIndex.value];
})

debouncedWatch(query, async () => {
  selectedIndex.value = 0;
  if (query.value.length === 0) {
    list.value = [];
    fetchMore.value = null;
    return;
  }
  const res = await fetchFiles({
    q: `(name contains '${query.value}' or fullText contains '${query.value}') and mimeType != 'application/vnd.google-apps.folder' and trashed = false`,
  });
  list.value = res?.result || [];
  fetchMore.value = res?.fetchMore || null;
  if (!list.value.length) shake();

}, { debounce: 500 });

const onFetchMore = async (func) => {
  if (isLoading.value) return;
  const res = await func();
  list.value.push(...(res?.result || []));
  fetchMore.value = res?.fetchMore || null;
}

const onSelectFile = (file) => {
  selectFile(file);
  showSearch.value = false;
};

onKeyStroke('ArrowDown', (e) => {
  e.preventDefault();
  if (selectedIndex.value >= 0 && selectedIndex.value + 1 < list.value.length) selectedIndex.value++;
  else selectedIndex.value = 0;
  scrollToHighlighted();
});

onKeyStroke('ArrowUp', (e) => {
  e.preventDefault();
  if (selectedIndex.value > 0) selectedIndex.value--;
  else selectedIndex.value = list.value.length - 1;
  scrollToHighlighted();
});

onKeyStroke('Enter', (e) => {
  e.preventDefault();
  if (!list.value[selectedIndex.value]) return;
  onSelectFile(list.value[selectedIndex.value]);
});

onKeyStroke('Escape', (e) => {
  e.preventDefault();
  showSearch.value = false;
});

const scrollToHighlighted = () => {
  if (!list.value[selectedIndex.value]) return;
  document.getElementById('search-list').children[selectedIndex.value].scrollIntoView({ block: 'nearest' });
};

const parseDate = str => new Date(str).toLocaleString();

const shake = () => {
  const el = document.getElementById('omnibar');

  if (el.classList.contains('shake')) return;

  el.classList.add('shake');
  setTimeout(() => {
    el.classList.remove('shake');
  }, 500);
};

</script>
<style>
.shake {
  animation-duration: .6s;
  animation-timing-function: ease-in-out;
  animation-name: headShake;
  backface-visibility: hidden;
}

@keyframes headShake {
  0% {
    transform: translateX(-50%)
  }
  12.5% {
    transform: translateX(calc(-5px - 50%))
  }
  37.5% {
    transform: translateX(calc(4px - 50%))
  }
  62.5% {
    transform: translateX(calc(-2px - 50%))
  }
  87.5% {
    transform: translateX(calc(2px - 50%))
  }
  100% {
    transform: translateX(-50%)
  }
}
</style>