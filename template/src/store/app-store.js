import { defineStore } from "pinia";
import { useApiService } from "@/services/api-service";

import { findIndex, whereEq, assocPath } from "ramda";
import { getIP } from "@woolves/get_ip";

export const useAppStore = defineStore("app-store", {
  state: () => {
    return {
      passwordList: [],
      locale: null,
      animationSwitch: true,
      chatUrl: null,
      zaloUrl: null,
      lineUrl: null,
      apkUrl: "",
      ipaUrl: "",
      userIP: "123.123.123.123",
      promoteCode: null,
    };
  },
  actions: {
    savePassport(payload) {
      const targetIdx = findIndex(
        whereEq({ account: payload.account }),
        this.passwordList
      );
      if (targetIdx > -1) {
        this.passwordList = assocPath(
          [targetIdx, "password"],
          payload.password,
          this.passwordList
        );
      } else {
        this.passwordList = [payload];
      }
    },

    setLocale(payload) {
      this.locale = payload;
    },

    setAnimationSwitch(payload) {
      this.animationSwitch = payload;
    },

    setPromoteCode(payload) {
      this.promoteCode = payload;
    },

    async getDownloadUrl() {
      const api = useApiService();
      const res = await api.getDownloadUrl();
      if (res.code === 1) {
        this.apkUrl = res.data[0]?.apk_url ?? "";
        this.ipaUrl = res.data[0]?.ipa_url ?? "";
      }
      return res;
    },

    async getServiceUrl() {
      const api = useApiService();
      const res = await api.getServiceUrl();
      if (res.code === 1) {
        this.zaloUrl = res.data.zalo_url;
        this.lineUrl = res.data.line_url;
        this.chatUrl = res.data.service_url;
      }
      return res;
    },

    async getUserIP() {
      const res = await getIP();
      const currentIp = res.query;
      if (currentIp) this.userIP = currentIp;
      return currentIp;
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: "pl",
        storage: localStorage,
        paths: ["passwordList"],
      },
      {
        key: "locale",
        storage: localStorage,
        paths: ["locale"],
      },
      {
        key: "animationSwitch",
        storage: localStorage,
        paths: ["animationSwitch"],
      },
    ],
  },
});
