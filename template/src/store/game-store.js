import { defineStore } from "pinia";
import { useApiService } from "@/services/api-service";
import { useAuthStore } from "./auth-store";
import { useAppStore } from "@/store/app-store";

import { filter, propEq, isEmpty } from "ramda";

export const useGameStore = defineStore("game-store", {
  state: () => ({
    redPacket: null /** 小遊戲 */,
    games: [] /** 首頁遊戲 */,
    populars: [] /** 熱門 */,
    recents: [] /** 最近遊玩 */,
    existLocales: [] /** 已存在的語言包 */,
  }),
  actions: {
    $reset() {
      this.redPacket = null;
      this.populars = [];
      this.recents = [];
    },

    async getAdditionReceive() {
      const api = useApiService();
      const res = await api.getAddition();
      if (res.code === 1) {
        for (const addition of res.data) {
          switch (addition.type) {
            case 1:
              this.redPacket = addition;
          }
        }
      }
      return res;
    },

    async getAdditionUrl() {
      const authStore = useAuthStore();
      const appStore = useAppStore();
      return `${import.meta.env.VITE_ENV_GAME_URL}?p=${
        authStore.user.phone
      }&lang=${appStore.locale}`;
    },

    async getPopular() {
      const api = useApiService();
      const res = await api.getGames({
        type: "popular",
      });
      if (res.code === 1) {
        this.populars = res.data;
      }
      return res;
    },

    async getRecent() {
      const api = useApiService();
      const res = await api.getGames({
        type: "recent",
      });
      if (res.code === 1) {
        this.recents = res.data;
      }
      return res;
    },

    async getGames() {
      const appStore = useAppStore();
      const api = useApiService();
      const res = await api.getGames();
      if (res.code === 1) {
        this.games = res.data;
        this.populars = filter(propEq("is_popular", 1), res.data);
        this.recents = filter(propEq("is_recent", 1), res.data);
        this.existLocales = [...this.existLocales, appStore.locale];
      }
      return res;
    },

    async getGameLocales(payload) {
      const api = useApiService();
      /** 拿過不再拿 */
      if (this.existLocales.includes(payload.locale)) {
        return { data: {} };
      }
      const res = await api.getGameLocales({ locale: payload.locale });
      if (!isEmpty(res.data)) {
        this.existLocales = [...this.existLocales, payload.locale];
      }
      return res;
    },
  },
});
