<template>
  <Popup
    ref="popup"
    :custom="true"
    :x-offset="10"
    :y-offset="-10"
    transition="scale-sm"
    @toggle="$emit('toggle', $event)"
  >
    <!-- @toggle="contextMenuIsVisible = $event" -->
    <template #default="{ close }">
      <div
        :data-value="file.name"
        class="relative rounded-lg input-sizer w-96 shadow-2xl"
      >
        <!-- https://codepen.io/shshaw/pen/c72208b279d750f1ab46b6a45bbd04d7 -->
        <textarea
          rows="1"
          placeholder="File name"
          ref="input"
          :value="file.name"
          class="
            outline-none
            focus:border-primary-500
            block
            w-full
            border-2
            border-gray-200
            rounded-lg
            h-full
          "
          @input="
            ($event) => {
              $event.target.parentNode.dataset.value = $event.target.value;
            }
          "
          @keydown.enter.prevent="() => onSubmit(close)"
        >
        </textarea>
        <div class="absolute bottom-[5px] right-[5px] flex items-center">
          <div
            class="
              text-gray-500
              btn
              bg-gray-50
              border border-gray-200
              h-full
              px-2.5
              py-1.5
              rounded-md
              text-sm
              shadow-sm
              inline-flex
              items-center
            "
            @click="() => onSubmit(close)"
          >
            <GIcon name="enter" :size="12" class="mr-2" /> Save
          </div>
        </div>
      </div>
    </template>
  </Popup>
</template>

<script>
import Popup from '@/components/Popup.vue';
import GIcon from '@/components/GIcon.vue';
import useStore from '@/store';

export default {
  emits: ['toggle'],
  components: {
    Popup,
    GIcon,
  },
  props: {
    file: {
      type: Object,
      default: null,
    },
  },
  methods: {
    show() {
      this.$refs.popup.show(...arguments);
      setTimeout(() => {
        this.$refs.input.focus();
        this.$refs.input.select();
      }, 0);
    },
    onSubmit(callback) {
      useStore().updateFile(this.file.id, { resource: { name: this.$refs.input.value } });
      callback();
    },
  },
};
</script>

<style lang="scss">
.input-sizer {
  display: inline-grid;
  vertical-align: top;
  align-items: center;
  position: relative;
  &::after,
  input,
  textarea {
    grid-area: 1 / 1;
    overflow: hidden;
  }

  &::after,
  input,
  textarea {
    border-width: 2px;
    width: 100%;
    min-width: 1em;
    font-family: inherit;
    font-size: 15px;
    margin: 0;
    resize: none;
    appearance: none;
    padding-left: 12px;
    padding-right: 80px;
    white-space: pre-wrap;
    padding-top: 8px;
    padding-bottom: 8px;
    line-height: 1.5;
  }

  &::after {
    content: attr(data-value) ' ';
    visibility: hidden;
    word-break: break-word;
  }
}
</style>
