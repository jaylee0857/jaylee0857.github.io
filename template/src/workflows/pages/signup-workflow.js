import { defineWorkflow } from "@/_app/_define";
import { createPassport } from "../common/core/passport";
import { exhaustOf, queueOf } from "../common/core/observers";
import { withPayload } from "../common/core/operators";

/** stores */
import { useAuthStore } from "@/store/auth-store";
import { useAppStore } from "@/store/app-store";

/** services */
import { useApiService } from "@/services/api-service";
import { useI18nService } from "@/services/i18n-service";

/** workflows */
import { usePopupWorkflow } from "@/workflows/common/popup-workflow";

export const useSignupWorkflow = defineWorkflow("signup-workflow", () => {
  const authStore = useAuthStore();
  const appStore = useAppStore();
  const apiService = useApiService();
  const popupWorkflow = usePopupWorkflow();
  const { t: rootMessages } = useI18nService();

  const createSendCaptchaPassport = () => {
    const passport = createPassport(
      "signup.sendCaptcha",
      apiService.sendCaptcha
      //
    ).pipe(
      withPayload()
      //
    );
    const observer = exhaustOf(passport);

    return async (payload) => {
      passport.call("payload", {
        phone: payload.phone,
      });
      return observer.excute();
    };
  };

  const createRegisterPassport = () => {
    const passport = createPassport(
      "signup.register",
      apiService.register
      //
    ).pipe(
      withPayload()
      //
    );
    const observer = exhaustOf(passport);

    return async (payload) => {
      passport.call("payload", {
        account: payload.account, //帳號
        password: payload.password, //密碼
        passwordConfirmed: payload.passwordConfirmed, //確認密碼
        phone: payload.phone,
        captcha: payload.captcha,
        deviceInfo: payload.deviceInfo,
      });
      return observer.excute();
    };
  };

  const createPostPromoteCodePassport = () => {
    const passport = createPassport(
      "signup.postPromoteCode",
      apiService.postPromoteCode
      //
    );
    const observer = exhaustOf(passport);

    return async () => {
      return observer.excute();
    };
  };

  const createPostPromoteStatsPassport = () => {
    let count = 0;
    const passport = createPassport(
      "signup.postPromoteStats",
      async (payload) => {
        const res = await apiService.postPromoteStats(payload);
        switch (res.code) {
          case 1:
            count = 0;
            return;

          default:
            /** 試 10 次就可以了吧 */
            if (++count <= 10) {
              return postPromoteStats(payload);
            }
            return;
        }
      }
      //
    ).pipe(
      withPayload()
      //
    );
    const observer = queueOf(1000)(passport);

    return async (payload) => {
      passport.call("payload", {
        account: payload.account,
        date: payload.date,
        domain: payload.domain,
      });
      return observer.excute();
    };
  };

  const sendCaptcha = createSendCaptchaPassport();

  /** 註冊 */
  const register = createRegisterPassport();

  /** 設定推薦人 */
  const postPromoteCode = createPostPromoteCodePassport();

  /** 寫入推廣流量數據 */
  const postPromoteStats = createPostPromoteStatsPassport();

  /** 註冊流程 */
  const signupFlow = async (payload) => {
    const loadingStop = popupWorkflow.loadingStart();
    const res = await register({
      account: payload.account, //帳號
      password: payload.password, //密碼
      passwordConfirmed: payload.passwordConfirmed, //確認密碼
      phone: payload.phone,
      captcha: payload.captcha,
      deviceInfo: payload.deviceInfo,
    });

    switch (true) {
      case res.code < 0:
        /** 有定義的錯誤 */
        popupWorkflow.alert({
          title: rootMessages("app.dialog.system.title2"),
          text: rootMessages(`error.code.register.${res.code}`),
        });
        loadingStop();
        return;

      case res.code === 1: {
        /** 背景處理：寫入推廣流量數據 */
        postPromoteStats({
          account: payload.account,
          date: payload.date,
          domain: payload.domain,
        });
        const loginRes = await loginFlow({
          account: payload.account,
          password: payload.password,
        });
        loadingStop();
        return loginRes;
      }

      default:
        /** 公共錯誤碼 */
        popupWorkflow.alert({
          title: rootMessages("app.dialog.system.title2"),
          text: rootMessages(`error.code.${res.code}`),
        });
        loadingStop();
        return;
    }
  };

  /**
   * 登入流程
   */
  const loginFlow = async (payload) => {
    const response = await authStore.login({
      account: payload.account,
      password: payload.password,
    });
    if (response.code === 1) {
      const data = await authStore.getUser();
      if (data) {
        /** 背景處理：設定推薦人 */
        if (appStore.promoteCode) {
          postPromoteCode();
        }

        /** 返回登入成功 */
        return "LOGIN_SUCCESS";
      }
    }
    /** 登入失敗提示 */
    popupWorkflow.alert({
      title: rootMessages("app.dialog.system.title2"),
      text: rootMessages("error.to.login.again"),
    });
    return "LOGIN_FAILED";
  };

  return {
    sendCaptcha,
    signupFlow,
  };
});
