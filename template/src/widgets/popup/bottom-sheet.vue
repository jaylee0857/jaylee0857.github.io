<template>
  <div class="bottom__picker">
    <div class="bottom__picker__actions">
      <slot name="actions"></slot>
    </div>
    <div class="bottom__picker__content">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<style lang="scss">
.bottom__picker {
  @apply fixed bottom-0 w-[100vw] bg-white;
  &__actions {
    @apply bg-gray-100 flex justify-between items-center p-5 mb-6 font-normal text-30 text-blue-600;
    & .confirm-button {
      @apply ml-auto;
    }
  }
}
</style>
