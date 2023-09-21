<template>
  <div class="giveaway">
    <div class="giveaway__content">
      <slot name="content"></slot>
    </div>
    <div class="giveaway__actions">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<style lang="scss">
.giveaway {
  @apply font-sans;
  &__actions {
    display: flex;
    align-items: center;
    justify-content: center;
    .confirm-button {
      width: 100%;
      height: 1rem;
      font-size: 0.3rem;
      color: #a4a4a4;
      margin-top: 1.2rem;
    }
    .cancel-button {
      // width: 100%;
      width: 3rem;
      height: 1.5rem;
      font-size: 0.3rem;
      color: #000;
      margin: 0 auto;
      margin-top: 1.2rem;
      background: url("@/assets/images/withdraw/btn_chest.png") no-repeat center /
        cover;
    }
  }
  &__content {
    position: relative;
    &__btn {
      @apply font-sans;
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      top: 6rem;
      margin: 0 4.5rem;
      width: 7rem;
      font-size: 0.28rem;
      white-space: pre-wrap;
      color: #434343;
      background: url("@/assets/images/withdraw/img_jewelrybox_ content_bg.png")
        no-repeat center;
      background-size: 7.7rem 5.2rem;
      line-height: 0.4rem;
      &-en {
        background-size: 7.7rem 8rem;
      }
      &-ph {
        background-size: 7.7rem 11rem;
      }
      &-vn {
        background-size: 7.7rem 9.5rem;
      }
      &__content {
        display: flex;
        flex-flow: column;
        align-items: flex-start;
        justify-content: center;
        width: 76vw;
        padding: 0.2rem 0.2rem;
        &-en {
          padding: 0.2rem 0.2rem;
        }
        &-ph {
          padding: 0.25rem 0.2rem;
        }
        &-vn {
          padding: 0.25rem 0.2rem;
        }
      }
    }
    &__caption {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      bottom: -0.3rem;
      width: 100%;
      .full {
        font-size: 0.28rem;
        color: #fff;
      }
    }
    &__reciprocal {
      position: absolute;
      top: -1.1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 2.5rem;
      font-size: 0.25rem;
      color: #fff;
      text-align: center;
      background: url("@/assets/images/withdraw/img_jewelrybox_title_bg.png")
        no-repeat center / contain;
      &__icon {
        margin-right: 0.05rem;
        width: 0.25rem;
        height: 0.25rem;
        background: url("@/assets/images/withdraw/clock.svg") no-repeat center /
          cover;
      }
      &__text {
        margin-top: 0.02rem;
      }
    }
    .full {
      white-space: pre-wrap;
      text-align: center;
    }
    .text--orange {
      color: #ff8a00;
    }
    .text--yellow {
      color: #ffd874;
    }
  }

  &__loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 1rem;
    width: 1rem;
    background-image: url("@/assets/images/loading.gif");
    background-repeat: no-repeat;
    background-size: contain;
    opacity: 0.8;
  }
}
</style>
