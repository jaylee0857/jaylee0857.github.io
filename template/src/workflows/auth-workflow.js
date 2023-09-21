/**
 * 帳戶相關的放這邊
 */
import { defineWorkflow } from "@/_app/_define";
import { createPassport } from "./common/core/passport";
import {
  throttleOf,
  mergeOf,
  throttleExhaustOf,
  whileOnceOf,
} from "./common/core/observers";
import { withPayload } from "./common/core/operators";

/** stores */
import { useAuthStore } from "@/store/auth-store";

/** workflows */
import { useListenerWorkflow } from "./common/listener-workflow";
import { usePollingWorkflow } from "./common/polling-workflow";

export const useAuthWorkflow = defineWorkflow("auth-workflow", () => {
  const authStore = useAuthStore();
  const listenerWorkflow = useListenerWorkflow();
  const pollingWorkflow = usePollingWorkflow();

  const createGetUserPassport = () => {
    const passport = createPassport(
      "auth.getUser",
      authStore.getUser
      //
    );
    /** 3 秒內重複請求都拿到最後一次回傳值 */
    const observer = throttleOf(3000)(passport);

    /** 回傳 */
    return () => {
      return observer.excute();
    };
  };

  const createGetNoviceTaskPassport = () => {
    const passport = createPassport(
      "auth.getNoviceTask",
      authStore.getNoviceTask
      //
    );
    const observer = whileOnceOf((response) => response.code === 1)(passport);

    /** 回傳 */
    return () => {
      return observer.excute();
    };
  };

  const createUpdateNoviceTaskPassport = () => {
    const passport = createPassport(
      "auth.updateNoviceTask",
      authStore.updateNoviceTask
      //
    ).pipe(
      withPayload()
      //
    );
    const observer = mergeOf(passport);

    return (payload) => {
      passport.call("payload", payload);
      return observer.excute();
    };
  };

  const createUpdateCreditPassport = () => {
    const passport = createPassport(
      "auth.updateCredit",
      async (payload = {}) => {
        payload.setLoading?.(true);
        if (authStore.user.lock_credit === 1) {
          const unlockRes = await authStore.unlockCredit();
          if (unlockRes.code !== 1) {
            payload.setLoading?.(false);
            return {
              type: "unlockCredit",
              code: unlockRes.code,
            };
          }
        }
        const getUserRes = await authStore.getUser();
        payload.setLoading?.(false);
        if (getUserRes.code !== 1) {
          return {
            type: "getUser",
            code: getUserRes.code,
          };
        }
        return { code: 1 };
      }
      //
    ).pipe(
      withPayload()
      //
    );
    // 3秒才能執行一次
    const observer = throttleExhaustOf(3000)(passport);
    return (payload) => {
      passport.call("payload", payload);
      return observer.excute();
    };
  };

  const initial = () => {
    let pollingStop;
    listenerWorkflow.registerLoggedIn((isLoggedIn) => {
      if (isLoggedIn) {
        /** 拿會員各種第一次 */
        getNoviceTask();
        /** 輪詢拿個人資料 */
        pollingStop = pollingWorkflow.pollingStart(getUser, 30000);
      } else {
        pollingStop?.();
      }
    });
  };

  const getUser = createGetUserPassport();
  const getNoviceTask = createGetNoviceTaskPassport();
  const updateCredit = createUpdateCreditPassport();
  const updateNoviceTask = createUpdateNoviceTaskPassport();

  return {
    initial,
    getUser,
    getNoviceTask,
    updateCredit,
    updateNoviceTask,
  };
});
