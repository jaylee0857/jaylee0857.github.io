/**
 * banner store 封裝
 */
import { defineWorkflow } from "@/_app/_define";
import { createPassport } from "./common/core/passport";
import { onceOf } from "./common/core/observers";
import { useBannerStore } from "@/store/banner-store";

export const useBannerWorkflow = defineWorkflow("banner-workflow", () => {
  const bannerStore = useBannerStore();

  const createGetBannerPassport = () => {
    /**
     * passport主要是用來de bug 記錄用
     * 跟observer是搭配使用的 PS:一定要配溫開水(X
     * 首先Passport先建立格式並記錄，接著再用onceOf這類的observer下去觸發設定好的action
     * 下方例子來說createPassport第一個參數為記錄的名稱，第二個則為設定的action
     */
    const passport = createPassport(
      "banner.getBanner",
      () =>
        Promise.all([
          bannerStore.getBanner(),
          bannerStore.getRank(),
          //
        ])
      //
    );
    /** 設定observable */
    const observer = onceOf(passport);

    return () => observer.excute(); // 回傳取得response的function
  };

  const getBanner = createGetBannerPassport();

  return {
    getBanner,
  };
});
