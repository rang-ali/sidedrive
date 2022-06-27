<template>
  <slot name="trigger" ref="trigger" :isOpen="showPopup" />
  <teleport to="body">
    <transition
      enter-active-class="transition-all duration-700"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
      appear
    >
      <div
        v-if="showPopup && overlay"
        :key="23"
        class="fixed z-50 inset-0 pointer-events-none bg-gray-800 bg-opacity-30"
      />
    </transition>
    <transition v-bind="transitionProps">
      <div
        v-if="showPopup"
        :class="[position.includes('bottom') ? 'origin-top-left' : 'origin-bottom-left']"
        class="fixed inset-0 z-50"
        @click.self="onClose"
      >
        <div ref="container" class="inline-block absolute" :style="popupStyle">
          <slot :close="close" />
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
import useStore from '@/store';
const MIN_INSET = 10;

export default {
  inheritAttrs: false,
  props: {
    yOffset: {
      type: Number,
      default: 0,
    },
    xOffset: {
      type: Number,
      default: 0,
    },
    custom: {
      type: Boolean,
      default: false,
    },
    overlay: {
      type: Boolean,
      default: false,
    },
    position: {
      type: String,
      default: 'bottom-left',
    },
    transition: {
      type: String,
      default: '',
    },
  },
  emits: ['toggle'],
  data() {
    return {
      showPopup: false,
      popupStyle: {},
    };
  },
  computed: {
    transitionProps() {
      if (this.transition === 'scale')
        return {
          'enter-active-class': this.transition ? 'transition duration-[100ms] ease-out' : '',
          'enter-from-class': 'transform scale-95 opacity-0',
          'enter-to-class': 'transform scale-100 opacity-100',
          'leave-active-class': this.transition ? 'transition duration-[50ms] ease-in' : '',
          'leave-from-class': 'transform scale-100 opacity-100',
          'leave-to-class': 'transform scale-95 opacity-0',
        };
      else if (this.transition === 'scale-sm')
        return {
          'enter-active-class': this.transition ? 'transition duration-[100ms] ease-out' : '',
          'enter-from-class': 'transform scale-[98%] opacity-0',
          'enter-to-class': 'transform scale-100 opacity-100',
          'leave-active-class': this.transition ? 'transition duration-[50ms] ease-in' : '',
          'leave-from-class': 'transform scale-100 opacity-100',
          'leave-to-class': 'transform scale-[98%] opacity-0',
        };
      return {};
    },
  },
  mounted() {
    if (this.custom) return;
    this.$el.nextElementSibling?.addEventListener('click', () => this.onShow({ element: '$el' }));
  },
  beforeDestroy() {
    if (this.custom) return;
    this.$el.nextElementSibling?.removeEventListener('click', () => this.onShow({ element: '$el' }));
  },
  methods: {
    show(event) {
      this.onShow(event);
    },
    close(callback) {
      callback && callback();
      this.onClose();
    },
    onShow({ event, element }) {
      document.addEventListener('keyup', this.onEscape);
      this.popupStyle = { visibility: 'hidden' }
      this.showPopup = true;
      this.$emit('toggle', true);
      useStore().popupIsOpen.value = true;

      let top = 0;
      let left = 0;

      setTimeout(() => {
        const containerBcr = this.$refs.container.firstElementChild.getBoundingClientRect();

        if (event) {
          left = event.clientX;
          top = event.clientY;
        } else {
          element = element === '$el' ? this.$el.nextElementSibling : element;
          const triggerBcr = element.getBoundingClientRect();

          left = triggerBcr.left - (containerBcr.width * 0.5);
          if (this.position.includes('bottom')) {
            top = triggerBcr.top + triggerBcr.height + this.yOffset;;
          }
          if (this.position.includes('top')) {
            top = triggerBcr.top - containerBcr.height + this.yOffset;;
          }
          if (this.position.includes('left')) {
            left = triggerBcr.left + this.xOffset;
          }
          if (this.position.includes('right')) {
            left = Math.max(triggerBcr.left + triggerBcr.width - containerBcr.width + this.xOffset, MIN_INSET);
          }
        }
        
        // Check if container is inside viewport
        if (containerBcr.height + top + MIN_INSET > window.innerHeight) {
          top = window.innerHeight - containerBcr.height - MIN_INSET;
        }
        if (containerBcr.width + left - MIN_INSET > window.innerWidth) {
          left = window.innerWidth - containerBcr.width - MIN_INSET;
        }

        this.popupStyle = {
          top: `${top}px`,
          left: `${left}px`,
        }
      }, 0);
    },
    onClose() {
      this.showPopup = false;
      this.popupStyle = {};
      this.$emit('toggle', false);
      window.removeEventListener('keyup', this.onEscape);
      useStore().popupIsOpen.value = false;
    },
    onEscape(evt) {
      if (![27, 'Escape'].includes(evt.key)) return;
      this.onClose()
    },
  }
}
</script>
