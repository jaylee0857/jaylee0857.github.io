<template>
  <div class="gift-popup">
    <img
      class="gift-popup-bg"
      src="@/assets/images/home/img_alert_deposit.png"
      alt=""
    />
    <!-- <div class="gift-popup-title">
      <slot name="title"></slot>
    </div> -->
    <div class="gift-popup-content">
      <slot name="content"></slot>
    </div>
    <div class="gift-popup-button">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<style lang="scss">
.gift-popup {
  position: relative;
  width: 7.5rem;
  height: 7.5rem;
  animation: fadeInUp 0.8s linear;
  img {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  &-button,
  &-title,
  &-content {
    position: absolute;
    left: 0rem;
    width: 100%;
    font-family: "Roboto";
    font-style: normal;
    font-weight: 600;
    line-height: 24px;
    color: #641714;
    text-align: center;
    font-size: 0.3rem;
  }
  &-title {
    bottom: 3.7rem;
  }
  &-content {
    bottom: 4.4rem;
    padding: 0 2rem;
    padding-right: 1.68rem;
    white-space: pre-wrap;
    .text {
      &.low-height {
        line-height: 17px;
        font-size: 0.25rem;
      }
    }
  }
  &-button {
    padding: 0.2rem 0;
    bottom: 1.57rem;
    left: 0rem;
    width: 100%;
    .confirm-button {
      position: relative;
      left: 0.1rem;
      color: #fff;
      font-weight: 500;
    }
  }
}
</style>
