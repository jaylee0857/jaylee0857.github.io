<template>
  <teleport to="body">
    <div v-if="popupStore.$display">
      <!-- 透過display來決定顯示與否 -->
      <div
        ref="popupRef"
        class="fixed z-[1041] inset-0 w-full h-full flex justify-center items-center pointer-events-none"
      >
        <component class="popup__inner pointer-events-auto" :is="popupComp">
          <template #title>
            {{ popupStore.payload.title }}
          </template>

          <template #content>
            <component
              v-if="popupStore.payload.component"
              :is="popupStore.payload.component"
              ref="compRef"
              v-bind="popupStore.payload.props"
            />
            <div v-else>
              {{ popupStore.payload.text }}
            </div>
          </template>

          <template
            v-if="popupStore.payload.timer && popupStore.payload.timerProgress"
            #timer
          >
            <!-- Date.now() + payload.timer 現在時間加上指定時間則為倒數結束時間 -->
            <div
              class="timer-progress"
              :data-timer="popupStore.payload.timer"
              :data-end="Date.now() + popupStore.payload.timer"
            ></div>
          </template>

          <template #actions>
            <button
              v-if="popupStore.payload.showCancelButton"
              type="button"
              class="cancel-button"
              :class="{
                'cancel-button--two':
                  popupStore.payload.showConfirmButton &&
                  popupStore.payload.showCancelButton,
              }"
              @click="onDismiss"
            >
              {{ popupStore.payload.cancelButtonText }}
            </button>
            <button
              v-if="popupStore.payload.showConfirmButton"
              type="button"
              class="confirm-button"
              :class="{
                'cancel-button--two':
                  popupStore.payload.showConfirmButton &&
                  popupStore.payload.showCancelButton,
              }"
              @click="onConfirm"
            >
              {{ popupStore.payload.confirmButtonText }}
            </button>
          </template>
        </component>
      </div>
      <div
        v-if="popupStore.$display"
        ref="popupBackdropRef"
        class="fixed inset-0 z-[1040] w-[100vw] h-[100vh]"
        @click="onBackdropClick"
      />
    </div>
  </teleport>
</template>

<script setup>
import { computed, ref, markRaw, watch } from "vue";
import { usePopupStore } from "@/store/popup-store";
import gsap from "gsap";

/** components */
import Modal from "@/widgets/popup/modal";
import Rank from "@/widgets/popup/rank.vue";
import NewsModal from "@/widgets/popup/news.vue";
import LimitModal from "@/widgets/popup/limit.vue";
import VipModal from "@/widgets/popup/vip.vue";
import GiftModal from "@/widgets/popup/gift.vue";
import GiveAwayModal from "@/widgets/popup/giveaway.vue";
import PagingModal from "@/widgets/popup/paging.vue";
import BottomSheet from "@/widgets/popup/bottom-sheet";
import Surprise from "@/widgets/popup/surprise";

const popupStore = usePopupStore();

const resolve = (options) => {
  popupStore.$resolve({
    isConfirmed: false,
    isDismissed: false,
    dismiss: null,
    result: null,
    ...options,
  });
  popupStore.$reset();
};

/* 外匡樣式彈窗 */
const popupComp = computed(() => {
  switch (popupStore.payload.type) {
    case "Paging": // 輸光前往優惠通知
      return markRaw(PagingModal);
    case "Giveaway": // 輸光前往優惠通知
      return markRaw(GiveAwayModal);
    case "Gift": // 輸光前往優惠通知
      return markRaw(GiftModal);
    case "Vip": // vip通知
      return markRaw(VipModal);
    case "News": // 普通活動與通知
      return markRaw(NewsModal);
    case "Limit": // 限時活動
      return markRaw(LimitModal);
    case "Rank": // 排行榜
      return markRaw(Rank);
    case "BottomSheet": // 底部
      return markRaw(BottomSheet);
    case "Surprise": // 奇遇
      return markRaw(Surprise);
    default:
      return markRaw(Modal); // 預設使用sweetalert樣式
  }
});

/** 取得設定值 */
const duration = computed(() => popupStore.$duration / 1000 || 0.3);
const backdropColor = computed(
  () => popupStore.payload.BackdropStyle || "rgba(0, 0, 0, 0.6)"
);

/* contentComponent */
const compRef = ref();
let timerId = null;

/* 停止計時器 */
const stopTimerDesc = () => {
  clearTimeout(timerId);
  timerId = null;
};

/* autoClose or Timer發生變化時觸發 */
watch(
  [() => popupStore.payload.autoClose, () => popupStore.payload.timer],
  ([autoClose, timer]) => {
    /* 無倒數時間則不執行 */
    if (!timer) return;

    /** 怕重複觸發，先停止計時器 */
    stopTimerDesc();

    /** 計時器開始 */
    timerId = setTimeout(() => {
      stopTimerDesc();
      if (autoClose) _onReasonDismissed("timer");
      return;
    }, timer);
  }
);

/**
 * 各種 dismissed
 * @param {String} dismiss 'cancel' | 'backdrop' | 'timer'
 */
const _onReasonDismissed = async (dismiss) => {
  if (timerId) {
    /** 計時器進行中 則不可關閉*/
    if (!popupStore.payload.allowDismissWhenTimerRunning) return;
    stopTimerDesc();
  }

  /* 若元件中有onDismissed函式，則執行 這段就是在關閉的時候不同元件所執行的功能 類似sweetalert2中的willClose */
  if (compRef.value && "onDismissed" in compRef.value) {
    const result = await compRef.value.onDismissed();
    if (result) {
      /* 當resolve觸發時就表示此段promise結束 */
      await closePopupModal();
      resolve({
        isDismissed: true,
        dismiss,
        result,
      });
    }
  } else {
    await closePopupModal();
    resolve({
      isDismissed: true,
      dismiss,
    });
  }
};

/* 點擊背景 */
const onBackdropClick = async () => {
  /* 當不允許背景時 return */
  if (!popupStore.payload.allowOutsideClick) return;
  _onReasonDismissed("backdrop");
};

/* 按下取消 */
const onDismiss = async () => {
  _onReasonDismissed("cancel");
};

/* 按下確認 */
const onConfirm = async () => {
  /* 若倒數中 */
  if (timerId) {
    /* 若不允許倒數關閉 */
    if (!popupStore.payload.allowConfirmWhenTimerRunning) return;
    stopTimerDesc();
  }

  /* 若有content有元件 且元件內有onConfirmed屬性 利用的是vue的父直接控制子元件的功能*/
  if (compRef.value && "onConfirmed" in compRef.value) {
    const result = await compRef.value.onConfirmed();
    if (result) {
      await closePopupModal();
      resolve({
        isConfirmed: true,
        result,
      });
    }
  } else {
    await closePopupModal();
    resolve({
      isConfirmed: true,
    });
  }
};

/** 關閉彈窗 */
const closePopupModal = async () => {
  switch (popupStore.payload.type) {
    case "Paging":
      pageSlideOutAnimation();
      break;
    case "BottomSheet":
      slideOutAnimation();
      break;
    default:
      fadeOutAnimation();
      break;
  }
  await new Promise((resolve) => {
    setTimeout(resolve, popupStore.$duration);
  });
};

const popupRef = ref();
const popupBackdropRef = ref();
/** 監聽開關，觸發開關動畫 */
watch(
  () => [popupRef.value, popupBackdropRef.value, popupStore.$display],
  ([popup, popupBackdrop, display]) => {
    /** 等待渲染 */
    if (!popup || !popupBackdrop || !display) return;

    switch (popupStore.payload.type) {
      case "Paging":
        pageSlideInAnimation();
        break;
      case "BottomSheet":
        slideInAnimation();
        break;
      default:
        fadeInAnimation();
        break;
    }
  }
);

/** 動畫--整頁從右滑入 */
const pageSlideInAnimation = () => {
  /** 設置初始狀態 */
  gsap.set(popupRef.value, { opacity: 0, x: "100vw" });
  gsap.set(popupBackdropRef.value, {
    opacity: 0,
    backgroundColor: backdropColor.value,
  });

  /** 動畫內容 */
  gsap.to(popupRef.value, { duration: duration.value, opacity: 1, x: "0px" });
  gsap.to(popupBackdropRef.value, {
    duration: duration.value,
    opacity: 1,
  });
};
/** 動畫--往上滑入淡入 */
const fadeInAnimation = () => {
  /** 設置初始狀態 */
  gsap.set(popupRef.value, { opacity: 0, y: "50px" });
  gsap.set(popupBackdropRef.value, {
    opacity: 0,
    backgroundColor: backdropColor.value,
  });

  /** 動畫內容 */
  gsap.to(popupRef.value, { duration: duration.value, opacity: 1, y: 0 });
  gsap.to(popupBackdropRef.value, {
    duration: duration.value,
    opacity: 1,
  });
};
/** 動畫--往上滑入，背景淡入 */
const slideInAnimation = () => {
  /** 設置初始狀態 */
  gsap.set(popupRef.value, { y: "200px" });
  gsap.set(popupBackdropRef.value, {
    opacity: 0,
    backgroundColor: backdropColor.value,
  });

  /** 動畫內容 */
  gsap.to(popupRef.value, { duration: duration.value, y: 0 });
  gsap.to(popupBackdropRef.value, {
    duration: duration.value,
    opacity: 1,
  });
};

/** 動畫--整頁從右滑出 */
const pageSlideOutAnimation = () => {
  /** 動畫內容 */
  gsap.to(popupRef.value, { duration: duration.value, opacity: 0, x: "100vw" });
  gsap.to(popupBackdropRef.value, {
    duration: duration.value,
    opacity: 0,
  });
};
/** 動畫--往下滑出淡出 */
const fadeOutAnimation = () => {
  /** 動畫內容 */
  gsap.to(popupRef.value, { duration: duration.value, opacity: 0, y: "50px" });
  gsap.to(popupBackdropRef.value, {
    duration: duration.value,
    opacity: 0,
  });
};
/** 動畫--往下滑出，背景淡出 */
const slideOutAnimation = () => {
  /** 動畫內容 */
  gsap.to(popupRef.value, { duration: duration.value, y: "200px" });
  gsap.to(popupBackdropRef.value, {
    duration: duration.value,
    opacity: 0,
  });
};
</script>
