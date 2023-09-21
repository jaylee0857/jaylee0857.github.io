/**
 * 帳戶管理頁面守衛
 */
import { usePaymentStore } from "@/store/payment-store";
import { usePaymentWorkflow } from "@/workflows/payment-workflow";
import { usePopupWorkflow } from "@/workflows/common/popup-workflow";

/** 銀行卡資料寫入 context */
export const getBankCardGuard = async (to, from, next, ctx) => {
  const popupWorkflow = usePopupWorkflow();
  const paymentWorkflow = usePaymentWorkflow();
  const paymentStore = usePaymentStore();
  if (paymentStore.bankCard?.status !== 1) {
    /** 不是通過就重撈 */
    const stop = popupWorkflow.loadingStart();
    await paymentWorkflow.getBankbooks();
    stop();
  }
  ctx.bankCard = paymentStore.bankCard;
  next();
};

/** 沒資料就新增 */
export const toCreateBankCardGuard = (to, from, next, ctx) => {
  if (!ctx.bankCard) {
    next({ name: "/bankbook/create" });
  } else {
    next();
  }
};

/** 審核失敗導向修改 */
export const toUpdateBankCardGuard = (to, from, next, ctx) => {
  if (ctx.bankCard?.status === 3) {
    next({ name: "/bankbook/update" });
  } else {
    next();
  }
};

/** 審核中/通過導向詳情 */
export const toDetailBankCardGuard = (to, from, next, ctx) => {
  switch (ctx.bankCard?.status) {
    case 0:
    case 1:
      next({ name: "/bankbook" });
      break;
    default:
      next();
      break;
  }
};
