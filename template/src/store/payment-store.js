/**
 * 存提款集合
 */
import { defineStore } from "pinia";
import { useApiService } from "@/services/api-service";

export const usePaymentStore = defineStore("payment-store", {
  state: () => ({
    activity: null /** 充提贈點-活動資訊 */,
    bankBooks: [] /** 帳號金流列表 */,
    channels: [] /** 付款通道 */,
    washAmount: null /** 出款洗碼量 */,

    /**  */
    bankList: [] /** 各家銀行列表，新增帳戶時用 */,
  }),
  getters: {
    /** 銀行卡 */
    bankCard(state) {
      /**
       * !NOTICE
       * 目前帳戶類型只有銀行卡，所以用偷懶方式回傳第一筆
       * 若之後有新增其他類型，這段要改成篩選
       */
      return state.bankBooks[0];
    },

    /** 出款方式 */
    channel(state) {
      /**
       * !NOTICE
       * 目前帳戶類型只有銀行卡，所以用偷懶方式回傳第一筆
       */
      return state.channels[0];
    },
  },
  actions: {
    async getActivity() {
      const api = useApiService();
      const res = await api.getPaymentActivity();
      if (res.code === 1) {
        this.activity = res.data;
      } else {
        this.activity = null;
      }
      return res;
    },

    async getBankbooks() {
      const api = useApiService();
      const res = await api.getPaymentBankbooks();
      if (res.code === 1) {
        this.bankBooks = res.data;
      }
      return res;
    },

    async getChannels() {
      const api = useApiService();
      const res = await api.getPaymentChannels();
      if (res.code === 1) {
        this.channels = res.data;
      }
      return res;
    },

    async getWashAmount() {
      const api = useApiService();
      const res = await api.getPaymentWashAmount();
      if (res.code === 1) {
        this.washAmount = res.data;
      }
      return res;
    },

    async getBankList() {
      const api = useApiService();
      const res = await api.getPaymentBankOptions();
      if (res.code === 1) {
        this.bankList = res.data;
      }
      return res;
    },
  },
});
