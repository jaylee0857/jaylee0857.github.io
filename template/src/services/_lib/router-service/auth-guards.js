/** stores */
import { useAuthStore } from "@/store/auth-store";

/** 拿登入資料寫入 context */
export const getUserDataGuard = (to, from, next, ctx) => {
  const authStore = useAuthStore();
  ctx.isLogin = authStore.isLogin;
  ctx.user = authStore.user;
  next();
};

/** 未登入不能進入 */
export const guestNotAllowGuard = (to, from, next, ctx) => {
  if (ctx.isLogin) {
    next();
  } else {
    next({ name: "/login" });
  }
};

/** 已登入後不能進入 */
export const authNotAllowGuard = (to, from, next, ctx) => {
  if (ctx.isLogin) {
    next({ name: "/home" });
  } else {
    next();
  }
};

/** 訪客能進 */
export const noGuard = (to, from, next) => {
  next();
};
