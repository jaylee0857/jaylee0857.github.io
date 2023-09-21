<template>
  <div class="popup-surprise">
    <div class="popup-surprise__head" id="surprise">
      <slot name="actions"></slot>
    </div>
    <div class="popup-surprise__main">
      <slot name="content"></slot>
    </div>
    <div class="popup-surprise__footer">
      <slot name="actions"></slot>
    </div>
  </div>
</template>
<style lang="scss">
.popup-surprise {
  width: 100vw;
  height: 109.87vw;
  font-size: 0.4rem;
  background: url("@/assets/images/popup_surprise.png") no-repeat center /
    contain;

  &__head {
    position: relative;
    height: 0.6rem;

    .confirm-button {
      display: none;
    }
    .cancel-button {
      position: absolute;
      top: 0;
      right: 0.5rem;
      width: 0.5rem;
      height: 0.5rem;
      background: url("@/assets/images/icon_cancel-2.png") no-repeat center /
        cover;
      color: transparent;
      font-size: 0.2rem;
      white-space: nowrap;
    }
  }

  &__main {
    position: relative;
    top: 1.4rem;
    left: 3.4rem;
    height: 46vw;
    width: 37.5vw;
    color: white;
    overflow-y: overlay;
    font-size: 0.2rem;
    .text {
      padding-right: 0.1rem;
    }
    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 20px;
      background-color: #905cff;
    }
  }

  &__footer {
    padding-top: 2.22rem;
    display: flex;
    justify-content: center;
    .confirm-button {
      margin-left: 0.7rem;
      width: 2.2rem;
      height: 0.75rem;
      color: #fff;
      background: url("@/assets/images/popup_surprise-btn.png") no-repeat center /
        contain;
      border-radius: 4px;
      font-size: 0.27rem;
    }
    .cancel-button {
      display: none;
    }
  }
}
</style>
