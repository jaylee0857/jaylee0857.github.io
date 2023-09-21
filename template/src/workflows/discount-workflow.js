/**
 * discount store 封裝
 */
import { defineWorkflow } from "@/_app/_define";
import { usePopupWorkflow } from "@/workflows/common/popup-workflow";
import { createPassport } from "./common/core/passport";
import { exhaustOf, whileOnceOf } from "./common/core/observers";
import { withPayload } from "./common/core/operators";

/** stores */
import { useDiscountStore } from "@/store/discount-store";

/** services */
import { useI18nService } from "@/services/i18n-service";

/** workflows */
import { useListenerWorkflow } from "./common/listener-workflow";

export const useDiscountWorkflow = defineWorkflow("discount-workflow", () => {
  const discountStore = useDiscountStore();
  const popupWorkflow = usePopupWorkflow();
  const { t } = useI18nService();
  const listenerWorkflow = useListenerWorkflow();
  const createGetDiscountPassport = () => {
    const passport = createPassport(
      "discount.getDiscount",
      async () => {
        const loadingStop = popupWorkflow.loadingStart();
        const [discountRes] = await Promise.all([
          discountStore.getDiscounts(),
          discountStore.getRank(),
          discountStore.getVip(),
          //
        ]);
        loadingStop();
        const SUCCESS = discountRes.code === 1;
        if (!SUCCESS) {
          popupWorkflow.alert({
            title: t("app.dialog.system.title2"),
            text: t("feedback.read.failed"),
          });
        }
        return {
          origin: discountRes.data,
          state: SUCCESS,
        };
      }
      //
    );
    /** 設定observable */
    const observer = whileOnceOf((response) => response.code === 1)(passport);

    return () => observer.excute(); // 回傳取得response的function
  };

  const createdDiscountApplyPassport = () => {
    const passport = createPassport(
      "discount.applyDiscount",
      async (payload) => {
        const loadingStop = popupWorkflow.loadingStart();
        const res = await discountStore.applyDiscount(payload);
        loadingStop();
        return res;
      }
    ).pipe(
      withPayload()
      //
    );
    const observer = exhaustOf(passport);

    return (payload) => {
      const { discountId, discountType, discountAutoAuth } = payload;
      passport.call("payload", {
        discountId,
        discountType,
        discountAutoAuth,
      });
      return observer.excute();
    };
  };

  const createReloadDiscountPassport = () => {
    const passport = createPassport(
      "discount.reloadDiscount",
      async () => {
        /** 有資料時才需reload */
        await discountStore.getDiscounts();
      }
      //
    );
    /** 設定observable */
    const observer = exhaustOf(passport);

    return () => observer.excute(); // 回傳取得response的function
  };

  const initial = () => {
    /** 建立監聽：有符合資格可參加的優惠出現 */
    listenerWorkflow.registerNotify("promote", (hasPromote) => {
      if (hasPromote) {
        reloadDiscount();
      }
    });
    /** 建立監聽：優惠審核拒絕 */
    listenerWorkflow.registerNotify("promote_map", (hasPromote) => {
      if (hasPromote) {
        discountStore.rejectDiscount(hasPromote.msg);
      }
    });
  };

  const getDiscount = createGetDiscountPassport();
  const applyDiscount = createdDiscountApplyPassport();
  const reloadDiscount = createReloadDiscountPassport();

  return {
    initial,
    getDiscount,
    applyDiscount,
    reloadDiscount,
  };
});
