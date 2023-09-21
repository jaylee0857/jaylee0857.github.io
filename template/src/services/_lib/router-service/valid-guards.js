import { checkPhone } from "@/tool";
import { isEmpty } from "ramda";

/** 客服彈跳彈窗 */
export const checkPhoneGuard = async (to, from, next, ctx) => {
  let forwardPath = await checkPhone({
    realName: isEmpty(ctx.user.realname ?? ""),
    phone: isEmpty(ctx.user.phone ?? ""),
  });
  if (forwardPath === "/discount") {
    next();
    return;
  }
  const redirectTo = forwardPath === "cancel" ? from.path : forwardPath;
  next({ name: redirectTo });
};
