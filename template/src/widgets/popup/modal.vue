<template>
  <div
    class="popup-modal swal2-popup swal2-modal swal2-confirm"
    tabindex="-1"
    style="display: grid"
  >
    <h2 class="swal2-title" style="display: block">
      <slot name="title"></slot>
    </h2>
    <div class="swal2-html-container" style="display: block">
      <slot name="content"></slot>
    </div>
    <div class="swal2-actions" style="display: flex">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<style lang="scss">
.popup-modal .cancel-button {
  font-size: 0.35rem;
  padding: 0.2rem;
  color: #333 !important;
  background: linear-gradient(180deg, #f1c594 18.75%, #fbe1b8 100%);
  flex: 1;
  border-radius: 0 0 8px 8px;
  max-width: 99%;
  max-height: 93%;
  &.cancel-button--two {
    max-width: 49.5%;
    border-radius: 0 0 0px 8px;
  }
}

.popup-modal .confirm-button {
  color: #fff;
  background: linear-gradient(180deg, #aa2121 0%, #5a0a0a 100%);
  font-size: 0.35rem;
  padding: 0.2rem;
  flex: 1;
  border-radius: 0 0 8px 8px;
  max-width: 99%;
  max-height: 93%;
  &.cancel-button--two {
    max-width: 49.5%;
    border-radius: 0 0 8px 0px;
  }
}
</style>
