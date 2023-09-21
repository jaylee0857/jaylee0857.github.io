import { defineStore } from "pinia";
import { useApiService } from "@/services/api-service";
import { isToday } from "date-fns";
import storage from "store2";

export const useAuthStore = defineStore("auth-store", {
  state: () => ({
    accessToken: null,
    user: {},

    isOldBird: 0 /* 是否為老鳥(登入過) */,
    isEnteredAddition: 0 /* 是否進入過抽小紅包 */,
    isConfirmedToWithdraw: 0 /* 是否彈出前往提款彈窗(未進入過取款+已進入過小遊戲) */,
    isEnteredWithdraw: 0 /* 是否進入提款 */,

    dailyHintReadAt: null /* 每日提示讀取時間 */,
  }),
  getters: {
    isLogin: (state) => "id" in state.user,
    isDailyHintRead: (state) =>
      state.dailyHintReadAt ? isToday(new Date(state.dailyHintReadAt)) : false,
  },
  actions: {
    /** 標示今日已看過 */
    markDailyHintRead() {
      this.dailyHintReadAt = Date.now();
    },
    /** API */
    async login(payload) {
      const api = useApiService();
      const res = await api.login({
        account: payload.account,
        password: payload.password,
      });
      if (res.code === 1) {
        /** login success */
        this.accessToken = res.data.jwt_token;
      }
      return res;
    },

    async logout() {
      const api = useApiService();
      await api.logout();
      this.$reset();
      /**
       * @TODO 待整理
       */
      storage.remove("article");
    },

    async getUser() {
      const api = useApiService();
      const res = await api.getUser();
      if (res.code === 1) {
        // 特例帳號
        if (res.data.account === "tongdaily") {
          const temp = res.data;
          temp.vip.vip = 3;
          this.user = temp;
        } else {
          this.user = res.data;
        }
      }
      return res;
    },

    async getNoviceTask() {
      const api = useApiService();
      const res = await api.getNoviceTask();
      if (res.code === 1) {
        this.isOldBird = this.isOldBird || res.data.first_login_notify;
        this.isEnteredAddition =
          this.isEnteredAddition || res.data.first_addition_notify;
        this.isConfirmedToWithdraw =
          this.isConfirmedToWithdraw || res.data.first_home_withdraw_notify;
        this.isEnteredWithdraw =
          this.isEnteredWithdraw || res.data.first_withdraw_notify;
      }
      return res;
    },

    async updateNoviceTask(payload) {
      const api = useApiService();
      const res = await api.updateNoviceTask({
        type: {
          isOldBird: "first_login_notify",
          isEnteredAddition: "first_addition_notify",
          isConfirmedToWithdraw: "first_home_withdraw_notify",
          isEnteredWithdraw: "first_withdraw_notify",
        }[payload.type],
      });
      this[payload.type] = 1;
      return res;
    },

    async lockCredit(payload) {
      const api = useApiService();
      const res = await api.updateCreditLock({
        lock: 1,
        platform: payload.platform,
        game: payload.game,
      });
      if (res.code === 1) {
        this.user.lock_credit = 1;
      }
      return res;
    },

    async unlockCredit() {
      const api = useApiService();
      const res = await api.updateCreditLock({
        lock: 0,
      });
      if (res.code === 1) {
        this.user.lock_credit = 0;
      }
      return res;
    },

    async updatePassword(payload) {
      const api = useApiService();
      const res = await api.updatePassword({
        old_password: payload.origin,
        password: payload.new,
        password_confirmation: payload.confirm,
      });
      return res;
    },

    async updateAvatar(payload) {
      const api = useApiService();
      const res = await api.updateAvatar({
        image: payload.file,
      });
      if (res.code === 1) {
        this.user.avatar = res.data.avatar;
      }
      return res;
    },

    async updateName(payload) {
      const api = useApiService();
      const res = await api.updateName({
        nickname: payload.name,
      });
      if (res.code === 1) {
        this.user.nickname = payload.name;
      }
      return res;
    },

    async updateGender(payload) {
      const api = useApiService();
      const res = await api.updateGender({
        sex: payload.gender,
      });
      if (res.code === 1) {
        this.user.sex = Number(payload.gender);
      }
      return res;
    },

    async updateBirthday(payload) {
      const api = useApiService();
      const res = await api.updateBirthday({
        birthday: payload.birth,
      });
      if (res.code === 1) {
        this.user.birthday = payload.birth;
      }
      return res;
    },

    async updatePhone(payload) {
      const api = useApiService();
      const res = await api.updatePhone({
        phone: payload.phone,
        captcha: payload.captcha,
      });
      if (res.code === 1) {
        this.user.phone = payload.phone;
      }
      return res;
    },

    async resetPassword(payload) {
      const api = useApiService();
      const res = await api.resetPassword({
        password: payload.new,
        password_confirmation: payload.confirm,
        phone: payload.phone,
        captcha: payload.captcha,
      });
      return res;
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: "accessToken",
        storage: localStorage,
        paths: ["accessToken"],
      },
      {
        key: "dailyHintReadAt",
        storage: localStorage,
        paths: ["dailyHintReadAt"],
      },
    ],
  },
});
