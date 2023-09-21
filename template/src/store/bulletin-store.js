/**
 * 公告都放這邊
 */
import { defineStore } from "pinia";
import { useAuthStore } from "./auth-store";
import { useApiService } from "@/services/api-service";
import {
  filter,
  groupBy,
  prop,
  findIndex,
  remove,
  reject,
  includes,
  pluck,
} from "ramda";

export const useBulletinStore = defineStore("bulletin-store", {
  state: () => ({
    marquees: [] /* 跑馬燈 */,
    notifies: [] /* 通知 */,
    activities: [] /* 活動 */,
    limiteds: [] /* 限時 */,
    withdraws: [] /* 出款提示 */,
    isLimitedReadThisTime: false /* 限時在這次瀏覽中已讀 */,
    readRecords: {} /** 通知＋活動的讀取紀錄 */,
  }),
  persist: {
    enabled: true,
    strategies: [
      {
        key: "readRecords",
        storage: localStorage,
        paths: ["readRecords"],
      },
    ],
  },
  getters: {
    unreadMessages(state) {
      const authStore = useAuthStore();
      const readIds = this.readRecords[authStore.user.account] ?? [];
      return reject((message) => includes(message.id, readIds), [
        ...state.notifies,
        ...state.activities,
      ]);
    },
  },
  actions: {
    markLimitedRead() {
      this.isLimitedReadThisTime = true;
    },

    $reset() {
      this.isLimitedReadThisTime = false;
    },

    async getAllBulletin() {
      const api = useApiService();
      const res = await api.getAllBulletin();
      if (res.code === 1) {
        const groupByType = groupBy(prop("type"), res.data);
        this.marquees = groupByType[1] ?? [];
        this.notifies = groupByType[2] ?? [];
        this.activities = groupByType[3] ?? [];
        this.limiteds = filter(
          (limited) => limited.read_lock === 1,
          groupByType[4] ?? []
        );
      }
      return res;
    },

    async getWithdraw() {
      const api = useApiService();
      const res = await api.getOthersWithdrawMessages();
      if (res.code === 1) {
        this.withdraws = filter((item) => item.status === "success", res.data);
      }
      return res;
    },

    async updateLimited(payload) {
      const api = useApiService();
      const res = await api.updateLimited({
        id: payload.id,
        read_lock: payload.read_lock,
      });
      if (res.code === 1 && payload.read_lock === 0) {
        const targetIdx = findIndex(
          (limited) => limited.id === payload.id,
          this.limiteds
        );
        if (targetIdx > -1) {
          /** 直接移除，不重拿 */
          this.limiteds = remove(targetIdx, 1, this.limiteds);
        }
      }
      return res;
    },

    readAllMessages() {
      const authStore = useAuthStore();
      if (authStore.isLogin) {
        if (!(authStore.user.account in this.readRecords)) {
          this.readRecords[authStore.user.account] = [];
        }
        this.readRecords[authStore.user.account] = pluck("id", [
          ...this.notifies,
          ...this.activities,
        ]);
      }
    },
  },
});
