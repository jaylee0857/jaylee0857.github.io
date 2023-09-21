import { defineWorkflow } from "@/_app/_define";
import { createPassport } from "../common/core/passport";
import { exhaustOf } from "../common/core/observers";
import { withPayload } from "../common/core/operators";

/** store */
import { useAuthStore } from "@/store/auth-store";

/** services */
import { useApiService } from "@/services/api-service";
import { useI18nService } from "@/services/i18n-service";

/** workflows */
import { usePopupWorkflow } from "@/workflows/common/popup-workflow";

export const useReceiveWorkflow = defineWorkflow("receive-workflow", () => {
  const authStore = useAuthStore();
  const apiService = useApiService();
  const popupWorkflow = usePopupWorkflow();
  const { t: rootMessages, scope } = useI18nService();
  const { t: currentMessages } = scope("pages.receive");

  const createPostRedemptionPassport = () => {
    const passport = createPassport(
      "receive.postRedemption",
      apiService.postRedemption
      //
    ).pipe(
      withPayload()
      //
    );
    const observer = exhaustOf(passport);

    return async (payload) => {
      passport.call("payload", {
        sn: payload.sn,
      });
      return observer.excute();
    };
  };

  /** 兌換 */
  const onSubmit = async (payload) => {
    const loadingStop = popupWorkflow.loadingStart();
    const res = await postRedemption({
      sn: payload.sn,
    });
    loadingStop();
    if (res.code !== 1) {
      return popupWorkflow.alert({
        title: currentMessages("feedback.failed"),
        text: rootMessages(`error.code.receive.${res.code}`),
      });
    }

    //更新餘額
    authStore.getUser();

    const { give_amount: amount, wash_limit: limit } = res.data;
    // 提示成功
    popupWorkflow.alert({
      title: currentMessages("feedback.succeed"),
      text: currentMessages("feedback.succeed.content", { amount, limit }),
      style: "wrap-text",
    });
  };

  const postRedemption = createPostRedemptionPassport();

  return {
    onSubmit,
  };
});
