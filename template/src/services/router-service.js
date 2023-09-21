import { defineService } from "@/_app/_define";
import { createRouter, createWebHashHistory } from "vue-router";
import { createRoutes, useSubscribe } from "@/_app/routes";
import store from "@/services/store-service";
/** stores */
import { useAuthStore } from "@/store/auth-store";

/** workflows */
import { useAuthWorkflow } from "@/workflows/auth-workflow";
import { useUniqWorkflow } from "@/workflows/common/uniq-workflow";

/** guards */
import {
  getUserDataGuard,
  guestNotAllowGuard,
  authNotAllowGuard,
  noGuard,
} from "./_lib/router-service/auth-guards";
import { serviceGuard } from "./_lib/router-service/popup-guards";
import { checkPhoneGuard } from "./_lib/router-service/valid-guards";
import {
  getBankCardGuard,
  toCreateBankCardGuard,
  toUpdateBankCardGuard,
  toDetailBankCardGuard,
} from "./_lib/router-service/bankbook-guards";

/* 設定預設導入頁面 */
const options = {
  defaultPath: "/login",
};

const routes = createRoutes(options);
const subscibe = useSubscribe(routes);

/** 開始綁定 */
subscibe.beforeEnter("*", [getUserDataGuard, guestNotAllowGuard]) /** 預設 */;
/**
 * overwrite 為 true 就不會跑上面預設守衛事件
 */
subscibe.beforeEnter("/service", [serviceGuard], { overwrite: true });
subscibe.beforeEnter("/login", [getUserDataGuard, authNotAllowGuard], {
  overwrite: true,
});
subscibe.beforeEnter("/signup", [getUserDataGuard, authNotAllowGuard], {
  overwrite: true,
});
subscibe.beforeEnter("/forgot", [getUserDataGuard, authNotAllowGuard], {
  overwrite: true,
});
subscibe.beforeEnter("/home", [getUserDataGuard, noGuard], { overwrite: true });
subscibe.beforeEnter("/discount", [getUserDataGuard, checkPhoneGuard]);
subscibe.beforeEnter("/bankbook", [
  getBankCardGuard,
  toCreateBankCardGuard,
  toUpdateBankCardGuard,
]);
subscibe.beforeEnter("/bankbook/create", [
  getBankCardGuard,
  toUpdateBankCardGuard,
  toDetailBankCardGuard,
]);
subscibe.beforeEnter("/bankbook/update", [
  getBankCardGuard,
  toCreateBankCardGuard,
  toDetailBankCardGuard,
]);

/** 找不到就去首頁 */
subscibe.beforeEnter(
  "not-found",
  [
    (to, from, next) => {
      next({ name: "/home" });
    },
  ],
  { overwrite: true }
);

/* 建立router */
const router = createRouter({
  //hash模式
  history: createWebHashHistory(import.meta.env.BASE_URL),
  //掛載處理好的routes
  routes,
  scrollBehavior() {
    /** 換頁捲軸回到上方 */
    return { top: 0 };
  },
});

let isFirst = true;
router.beforeEach(async (to, from, next) => {
  if (!isFirst) {
    next();
    return;
  }

  /** 只要第一次進入，撈會員資料 */
  const authWorkflow = useAuthWorkflow();
  const authStore = useAuthStore();
  await authWorkflow.getUser();
  // eslint-disable-next-line require-atomic-updates
  isFirst = false;

  /** 沒登入且第一次進入，導到登入頁 */
  if (!authStore.isLogin) {
    /** 有 token 要清除，不然會有 100002 */
    if (authStore.accessToken) await authStore.logout();

    next({ name: "/login" });
    return;
  }

  next();
});

router.afterEach(() => {
  // TODO 待修
  const uniqWorkflow = useUniqWorkflow();
  uniqWorkflow.exit();

  /** 記錄導到登入頁的原因 */
  if (router.options.history.state.from)
    store.commit("app/set/recordFrom", router.options.history.state.from);
});

export const useRouterService = defineService("router-service", router);

export default router;
