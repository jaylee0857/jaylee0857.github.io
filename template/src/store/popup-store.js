import { defineStore } from "pinia";
import { markRaw } from "vue";
import { useI18nService } from "@/services/i18n-service";

export const usePopupStore = defineStore("popup-store", {
  state: () => ({
    $display: false,
    $timestamp: -1,
    $resolve: () => {},
    $payload: {},
    $duration: 300,
  }),
  getters: {
    payload: (state) => ({
      title: null, //標題
      text: null, //文字
      component: null, //中間元件
      showCancelButton: false, // 顯示取消按鈕
      showConfirmButton: false, // 顯示確認按鈕
      confirmButtonText: "Confirm", // 確認預設文案
      cancelButtonText: "Cancel", // 取消預設文案
      allowOutsideClick: true, // 是否可以點擊外面
      props: {}, // 傳送資料
      timer: null, // 時間
      timerProgress: false, // 時間進度條
      autoClose: false, // 自動關閉
      allowConfirmWhenTimerRunning: false, // 是否可以按下確認 在時間還還在倒數時
      allowDismissWhenTimerRunning: false, // 同上 只是改為關閉
      BackdropStyle: "rgba(0, 0, 0, 0.6)",
      ...state.$payload,
    }),
  },
  actions: {
    async modal(option = {}) {
      const i18n = useI18nService();
      const {
        title,
        text,
        component = null,
        showCancelButton = true,
        showConfirmButton = true,
        confirmButtonText = i18n.t("button.confirm"),
        cancelButtonText = i18n.t("button.cancel"),
        allowOutsideClick = true,
        props = {},
      } = option;

      this.$display = true;
      this.$timestamp = Date.now();
      this.$payload = {
        type: "Modal",
        title,
        text,
        component: component ? markRaw(component) : null,
        showCancelButton,
        showConfirmButton,
        confirmButtonText,
        cancelButtonText,
        allowOutsideClick,
        props,
      };
      return new Promise((resolve) => {
        this.$resolve = resolve;
      });
    },

    async rank(option = {}) {
      const i18n = useI18nService();
      const {
        title,
        text,
        component = null,
        showCancelButton = true,
        showConfirmButton = true,
        confirmButtonText = i18n.t("button.confirm"),
        cancelButtonText = i18n.t("button.cancel"),
        allowOutsideClick = true,
        props = {},
      } = option;

      this.$display = true;
      this.$timestamp = Date.now();
      this.$payload = {
        type: "Rank",
        title,
        text,
        component: component ? markRaw(component) : null,
        showCancelButton,
        showConfirmButton,
        confirmButtonText,
        cancelButtonText,
        allowOutsideClick,
        props,
      };
      return new Promise((resolve) => {
        this.$resolve = resolve;
      });
    },

    async news(option = {}) {
      const i18n = useI18nService();
      const {
        title,
        component = null,
        confirmButtonText = i18n.t("pages.home.welcome.close"),
        allowOutsideClick = true,
        props = {},
      } = option;
      this.$display = true;
      this.$timestamp = Date.now();
      this.$payload = {
        type: "News",
        title,
        component: component ? markRaw(component) : null,
        showConfirmButton: true,
        confirmButtonText,
        allowOutsideClick,
        props,
      };
      return new Promise((resolve) => {
        this.$resolve = resolve;
      });
    },

    async limit(option = {}) {
      const i18n = useI18nService();
      const {
        component = null,
        confirmButtonText = i18n.t("button.confirm"),
        props = {},
        timer = null,
      } = option;

      this.$display = true;
      this.$timestamp = Date.now();
      this.$payload = {
        type: "Limit",
        component: component ? markRaw(component) : null,
        showConfirmButton: true,
        confirmButtonText,
        props,
        allowOutsideClick: false,
        timer,
        timerProgress: true,
      };
      return new Promise((resolve) => {
        this.$resolve = resolve;
      });
    },

    async vip(option = {}) {
      const i18n = useI18nService();
      const {
        title,
        component = null,
        confirmButtonText = i18n.t("button.confirm"),
        allowOutsideClick = true,
        props = {},
      } = option;

      this.$display = true;
      this.$timestamp = Date.now();
      this.$payload = {
        type: "Vip",
        title,
        component: component ? markRaw(component) : null,
        showConfirmButton: true,
        confirmButtonText,
        allowOutsideClick,
        props,
      };
      return new Promise((resolve) => {
        this.$resolve = resolve;
      });
    },

    async gift(option = {}) {
      const i18n = useI18nService();
      const {
        component = null,
        confirmButtonText = i18n.t("button.confirm"),
        allowOutsideClick = true,
        props = {},
      } = option;

      this.$display = true;
      this.$timestamp = Date.now();
      this.$payload = {
        type: "Gift",
        component: component ? markRaw(component) : null,
        showConfirmButton: true,
        confirmButtonText,
        allowOutsideClick,
        props,
      };
      return new Promise((resolve) => {
        this.$resolve = resolve;
      });
    },

    async giveaway(option = {}) {
      const i18n = useI18nService();
      const {
        component = null,
        confirmButtonText = i18n.t("button.outsideclose"),
        allowOutsideClick = true,
        showConfirmButton = true,
        showCancelButton = false,
        cancelButtonText = i18n.t("pages.withdraw.prize.btn"),
        props = {},
        BackdropStyle = "rgba(0, 0, 0, 0.8)",
      } = option;

      this.$display = true;
      this.$timestamp = Date.now();
      this.$payload = {
        type: "Giveaway",
        component: component ? markRaw(component) : null,
        showConfirmButton,
        confirmButtonText,
        showCancelButton,
        cancelButtonText,
        allowOutsideClick,
        BackdropStyle,
        props,
      };
      return new Promise((resolve) => {
        this.$resolve = resolve;
      });
    },

    async paging(option = {}) {
      const i18n = useI18nService();
      const {
        title,
        component = null,
        showCancelButton = true,
        showConfirmButton = false,
        confirmButtonText = i18n.t("button.confirm"),
        cancelButtonText = "",
        allowOutsideClick = false,
        props = {},
      } = option;

      this.$display = true;
      this.$timestamp = Date.now();
      this.$payload = {
        type: "Paging",
        title,
        component: component ? markRaw(component) : null,
        showCancelButton,
        showConfirmButton,
        confirmButtonText,
        cancelButtonText,
        allowOutsideClick,
        props,
      };
      return new Promise((resolve) => {
        this.$resolve = resolve;
      });
    },

    async bottomSheet(option = {}) {
      const i18n = useI18nService();
      const {
        component = null,
        showConfirmButton = true,
        showCancelButton = true,
        confirmButtonText = i18n.t("button.confirm"),
        cancelButtonText = i18n.t("button.cancel"),
        allowOutsideClick = true,
        props = {},
        BackdropStyle = "rgba(0, 0, 0, 0.6)",
      } = option;

      this.$display = true;
      this.$timestamp = Date.now();
      this.$payload = {
        type: "BottomSheet",
        component: component ? markRaw(component) : null,
        showConfirmButton,
        showCancelButton,
        confirmButtonText,
        cancelButtonText,
        allowOutsideClick,
        props,
        BackdropStyle,
      };
      return new Promise((resolve) => {
        this.$resolve = resolve;
      });
    },

    async surprise(option = {}) {
      const i18n = useI18nService();
      const {
        component = null,
        confirmButtonText = i18n.t("button.confirm"),
        props = {},
      } = option;

      this.$display = true;
      this.$timestamp = Date.now();
      this.$payload = {
        type: "Surprise",
        component: component ? markRaw(component) : null,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText,
        allowOutsideClick: false,
        props,
      };
      return new Promise((resolve) => {
        this.$resolve = resolve;
      });
    },
  },
});
