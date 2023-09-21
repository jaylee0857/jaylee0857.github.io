import { defineStore } from "pinia";
import { useApiService } from "@/services/api-service";
import { useAuthStore } from "./auth-store";
import { pickBy, includes } from "ramda";

export const useNotifyStore = defineStore("notify-store", {
  state: () => ({
    withdraw: null /* 出款 */,
    vip: null /* vip升等 */,
    addition: null /* 小遊戲 */,
    news: null /* 公告 */,
    deposit: null /* 存款 */,
    promote: null /* 優惠 */,
    promote_map: null /*優惠 審核 */,
    user: null /*狀態 異動 */,
    lose_stat: null /*輸光 狀態 */,
    wash_amount_complete: null /*洗碼量 達標 */,
    promotion_mia: null /*全民 推廣 */,
    bet_record: null /*注單 結算 */,
    activity_wash_amount: null /*洗碼量 寶箱 */,
    activity_deposit_withdraw: null /*充提 贈點 */,
    addition_adventure: null /* 奇遇 */,

    hasHomePopupFlow: false /* 顯示過首頁popupFlow */,
  }),
  getters: {
    /** 紅點 */
    tips: (state) =>
      pickBy(
        (val, key) =>
          !!val &&
          includes(key, [
            "promote" /* 可參加優惠 */,
            "promote_map" /* 優惠審核 */,
            "promotion_mia" /* 全民推廣佣金領取 */,
            "activity_wash_amount" /* 洗碼量寶箱可領取 */,
            "activity_deposit_withdraw" /* 充提贈點 */,
            "bet_record" /* 注單結算 */,

            // case "wash_amount_complete": // 洗碼達標 不需要需求，故拔掉
            // case "deposit": // 存款 不需要需求
          ]),
        state
      ),
  },
  actions: {
    isTip(type) {
      return type in this.tips;
    },

    // ?????
    getHadValueTypeFirstItem(type) {
      const tip = this.tips[type];
      return tip?.msg ? tip : null;
      // return find((item) => item.type === type && item.msg !== "", this.tips);
    },

    pickNotify(payload) {
      return pickBy((val, key) => !!val && includes(key, payload), this.$state);
    },

    /** 撈資料 */
    async getNotify() {
      const authStore = useAuthStore();
      const api = useApiService();
      const res = await api.getNotify();
      if (res.code === 1) {
        /** 記錄資料 */
        for (const notify of res.data) {
          switch (notify.type) {
            case "vip":
              /* 當升級提示等於當前等級時才顯示 */
              if ((~~authStore.user.vip?.vip ?? 0) === ~~notify.msg) {
                this.vip = notify;
              }
              break;
            default:
              this[notify.type] = notify;
              break;
          }
        }
      }
      return res;
    },

    /** 標示已讀 */
    async readNotify(payload) {
      const authStore = useAuthStore();
      const api = useApiService();
      const res = await api.updateNotify({
        type: payload.type,
        msg: payload.msg,
      });
      if (res.code === 1) {
        switch (payload.type) {
          case "vip":
            /* 當升級提示等於當前等級時，清掉 */
            if (~~authStore.user.vip?.vip ?? 0 === ~~payload.msg) {
              this.vip = null;
            }
            break;
          default:
            /** 直接把讀取項目清掉 */
            this[payload.type] = null;
            break;
        }
      }
      return res;
    },

    homePopupFlowState() {
      this.hasHomePopupFlow = true;
    },
  },
});
