<template>
  <div class="popup-news">
    <div class="popup-news__head text-center" id="news">
      <slot name="title"></slot>
      <slot name="actions"></slot>
    </div>
    <div class="popup-news__main">
      <slot name="content"></slot>
    </div>
    <div class="popup-news__footer text-center">
      <slot name="actions"></slot>
    </div>
  </div>
</template>
<style lang="scss">
.popup-news {
  width: 75%;
  min-width: 75%;
  font-size: 0.4rem;
  background: linear-gradient(180deg, #feefe1 0%, #f8d9bd 100%);
  border-radius: 10px;
  overflow: hidden;

  &__head {
    position: relative;
    padding: 0.3rem;
    border-bottom: 1px solid #fcc5a6;

    .confirm-button {
      position: absolute;
      top: 0.45rem;
      right: 0.5rem;
      width: 0.3rem;
      height: 0.3rem;
      background: url("@/assets/images/icon_cancel.svg") no-repeat center /
        cover;
      color: transparent;
      font-size: 0.2rem;
      white-space: nowrap;
    }
  }

  &__main {
    height: 79%;
    background: transparent;
    overflow-y: overlay;
  }

  &__footer {
    padding: 0.15rem;
    color: #fff;
    background: linear-gradient(180deg, #aa2121 0%, #5a0a0a 100%);

    .confirm-button {
      width: 100%;
    }
  }
}
</style>
