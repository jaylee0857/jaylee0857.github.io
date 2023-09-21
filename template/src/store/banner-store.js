import { defineStore } from "pinia";
import { useApiService } from "@/services/api-service";
import { filter, sort, pipe } from "ramda";

export const useBannerStore = defineStore("banner-store", {
  state: () => ({
    banners: [],
    birds: [],
    snakes: [],
  }),

  actions: {
    async getBanner() {
      const api = useApiService();
      const res = await api.getBanner();
      if (res.code === 1) {
        this.banners = res.data.filter((data) => data.mobile_image !== "");
      }
      return res;
    },

    async getRank() {
      const api = useApiService();
      const res = await api.getRank();
      if (res.code === 1) {
        this.birds = pipe(
          filter((item) => !item.rank),
          sort((a, b) => a.account - b.account)
        )(res.data);
        this.snakes = pipe(
          filter((item) => item.rank),
          sort((a, b) => a.rank - b.rank)
        )(res.data);
      }
      return res;
    },
  },
});
