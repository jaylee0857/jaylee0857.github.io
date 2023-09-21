<template>
  <div class="limitact" :class="locale">
    <div class="limitact__active">
      <slot name="content"></slot>
      <div class="limitact__actions">
        <slot name="timer"></slot>
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>
<script setup>
import $ from "jquery";
import { onMounted } from "vue";
import { useI18nService } from "@/services/i18n-service";

const { locale } = useI18nService();
let remainder = 0;
let timerId = null;

/* 開始倒數 */
const startTimeDesc = () => {
  timerId = setInterval(() => {
    /* 小於等於0時觸發關閉function */
    if (remainder <= 0) {
      stopTimerDesc();
      removeRemainder();
      toggleConfirmDisabled();
      return;
    }
    remainder -= 1; // 倒數
    displayToElement(); // 渲染秒數
  }, 1000);
};

/* 關閉倒數 */
const stopTimerDesc = () => {
  clearInterval(timerId);
  timerId = null;
};

/* 顯示秒數 */
const displayToElement = () => {
  $(".limitact .timer-progress").html(function () {
    return $("<span>").html(`${remainder}sec`);
  });
};

/* 收回倒數 */
const removeRemainder = () => {
  $(".limitact .timer-progress").html(function () {
    return "";
  });
};

/* 將按鈕改為不可按下的樣式 */
const toggleConfirmDisabled = () => {
  $(".limitact .confirm-button").toggleClass("confirm-button--disabled");
};

onMounted(() => {
  /** 使用截止時間來計算比較準確 抓取the-popup中的data-end時間 */
  remainder = parseInt(
    ($(".limitact .timer-progress").data("end") - Date.now()) / 1000
  );
  displayToElement();
  toggleConfirmDisabled();
  startTimeDesc();
});
</script>

<style lang="scss">
.limitact {
  font-size: 0.24rem;

  &__active {
    background: #ec432e url("@/assets/images/limit_background.png") no-repeat
      center top;
    background-size: cover;
    position: absolute;
    top: 5%;
    left: 7%;
    bottom: 5%;
    right: 7%;
    border-radius: 0.2rem;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding: 0.3rem;
    &__kv {
      border-radius: 0.2rem;
      overflow: hidden;
      flex: none;
      margin-bottom: 0.3rem;
    }
    &__title {
      color: #fff;
      font-size: 0.36rem;
      line-height: 1.3em;
      padding-bottom: 0.2rem;
    }
    &__content {
      color: #ffd29c;
      font-size: 0.26rem;
      line-height: 1.5em;
      flex: 1;
      overflow: hidden;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }
    &__display {
      color: #ffd578;
      display: flex;
      align-items: center;
      padding: 0.3rem 0;
      font-size: 0.24rem;
      user-select: none;
      &.on {
        span {
          i {
            background-color: #ffd578;
          }
        }
      }
      span {
        flex: none;
        border: 1px solid #ffd578;
        margin-right: 0.1rem;
        display: block;
        border-radius: 3px;
        i {
          width: 0.22rem;
          height: 0.22rem;
          display: block;
          margin: 0.04rem;
          border-radius: 1px;
        }
      }
      p {
        flex: 1;
      }
    }
  }

  &__actions {
    position: relative;
    text-align: center;
  }

  &.ph {
    .confirm-button {
      font-size: 0.3rem;
    }
  }
}
.limitact .confirm-button {
  text-align: center;
  position: relative;
  width: 3.6rem;
  height: 1rem;
  margin: 0 auto;
  user-select: none;
  font-size: 0.4rem;
  color: #fff;
  background: #930302;
  background: linear-gradient(to bottom, #930302 0%, #4c0201 100%);
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#930302', endColorstr='#4c0201', GradientType=0);
  border-radius: 1rem;
  text-align: center;
  transition: all 0.3s ease;

  &--disabled {
    opacity: 0.2;
  }
}

.limitact .timer-progress {
  position: absolute;
  z-index: 1;
  left: 0;
  right: 0;
  height: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;

  span {
    font-size: 0.2rem;
    color: #ffd29c;
    border-radius: 0.3rem;
    border: 1px solid #985300;
    padding: 0.05rem 0.1rem;
    transform: translate(1.2rem, 0);
  }
}
</style>
