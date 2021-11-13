<template>
  <transition name="modal-fade">
    <div class="fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center backdrop-color" @click="close">
      <div class="relative rounded-sm max-w-full bg-white overflow-x-auto flex flex-col mt-0 mr-5 shadow-sm" @click.stop>
        <fa icon="times" class="text-black text-sm w-5 h-5 absolute right-5 top-5 cursor-pointer" @click="close" />
        <header v-if="hasHeaderSlot" class="m-5 flex-start justify-between text-xl">
          <slot name="header"></slot>
        </header>

        <div v-if="hasBodySlot" class="relative p-6 md:p-2.5">
          <slot name="body"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  computed: {
    hasHeaderSlot() {
      return !!this.$slots.header;
    },
    hasBodySlot() {
      return !!this.$slots.body;
    },
    hasFooterSlot() {
      return !!this.$slots.footer;
    }
  },
  methods: {
    close() {
      this.$emit("close");
    }
  }
};
</script>

<style lang="css">
.backdrop-color {
  background-color: rgba(0, 0, 0, 0.45);
}
.modal-fade-enter,
.modal-fade-leave-active {
  @apply opacity-0;
}
.modal-fade-enter-active,
.modal-fade-leave-active {
  @apply transition duration-300 ease-in-out;
}
</style>