import { defineStore } from "pinia";

/** services */
import { useApiService } from "@/services/api-service";

/** stores */
import { useNotifyStore } from "@/store/notify-store";

/** otherValue */
import {
  filter,
  sort,
  map,
  reduce,
  collectBy,
  indexBy,
  prop,
  pipe,
  values,
} from "ramda";
import { maskAccount } from "@/tool";

export const useDiscountStore = defineStore("discount-store", {
  state: () => ({
    /** vip 升級設定 */
    meta: {},
    vipList: [],
    /** 排行榜名單 鳳凰及黑龍、 */
    birds: [],
    snakes: [],
    /** 優惠列表 */
    $discounts: [],
  }),

  actions: {
    /** 取得排行榜 */
    async getRank() {
      const api = useApiService();
      const res = await api.getRank();
      if (res.code === 1) {
        const temp = map(
          (item) => ({
            ...item,
            account: maskAccount(item.account),
          }),
          res.data
        );
        this.birds = sort(
          (a, b) => a.account - b.account,
          filter((item) => !item.rank, temp)
        );
        this.snakes = sort(
          (a, b) => a.rank - b.rank,
          filter((item) => item.rank, temp)
        );
        this.meta = res.meta;
      }
      return res;
    },
    /** 取得VIP升級條件 */
    async getVip() {
      const api = useApiService();
      const res = await api.getVipList();
      if (res.code === 1) {
        this.vipList = res.data;
      }
      return res;
    },
    /** 取得優惠列表 */
    async getDiscounts() {
      const api = useApiService();
      const res = await api.getDiscounts();
      if (res.code === 1) {
        this.$discounts = res.data;
      }
      return res;
    },
    async applyDiscount(payload) {
      const api = useApiService();
      const { discountId, discountType, discountAutoAuth } = payload;
      const res = await api.applyDiscount({ discountId, discountType });
      switch (res.code === 1) {
        /** 當退出時 狀態改為未參加 */
        case discountType !== 1:
          this.setNewDiscountStatus(discountId, 0);
          break;

        /** 當參加且為手動審核時 狀態改為：待審核 */
        case discountAutoAuth === 0:
          this.setNewDiscountStatus(discountId, 2);
          break;

        /** 當參加且為自動審核時 狀態改為：自動審核中 */
        case discountAutoAuth === 1:
          this.setNewDiscountStatus(discountId, 3);
          break;
      }
      return res;
    },
    /** 更改個別優惠狀態 */
    setNewDiscountStatus(id, joined) {
      this.$discounts = map(
        (discount) => ({
          ...discount,
          joined: discount.id === id ? joined : discount.joined,
        }),
        this.$discounts
      );
    },
    /** 優惠被拒絕後狀態修改 */
    rejectDiscount(resId) {
      this.$discounts = map((discount) => {
        if (discount.id !== ~~resId) return discount;
        let record = discount.record;
        if (discount.auto_auth === 1) {
          /** 自動審核：僅把狀態改為可參加 */
          record = [
            {
              status: "auto_away",
            },
          ];
        }

        return {
          ...discount,
          record,
          joined: 0 /** 統一把狀態改為可參加 */,
        };
      }, this.$discounts);
    },
  },

  getters: {
    discounts: ({ $discounts }) => {
      /** 寫入紅點提示 */
      const notifyStore = useNotifyStore();
      const discountTips = notifyStore.pickNotify(["promote", "promote_map"]);
      const indexByLevel = indexBy(prop("msg"), values(discountTips));
      const setNotifyType = map((discount) => ({
        ...discount,
        tipType: indexByLevel[discount.id.toString()]?.type ?? "none",
      }));

      /** 打散vip資料準備分類 */
      const flattenVipLevel = reduce((arr, discount) => {
        const { vip: vips } = discount;
        return [...arr, ...map((vip) => ({ ...discount, vip: vip }), vips)];
      }, []);

      /** 根據vip等級做分類 */
      const collectByVipLevel = collectBy(prop("vip"));

      return pipe(
        setNotifyType,
        flattenVipLevel,
        collectByVipLevel
        //
      )($discounts);
    },
  },
});
