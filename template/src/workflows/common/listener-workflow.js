/**
 * 背景監聽的集合
 */
import { defineWorkflow } from "@/_app/_define";
import { watch } from "vue";

/** stores */
import { useAppStore } from "@/store/app-store";
import { useAuthStore } from "@/store/auth-store";
import { useNotifyStore } from "@/store/notify-store";

/** helper */
import { reject, equals } from "ramda";

export const useListenerWorkflow = defineWorkflow("listener-workflow", () => {
  const appStore = useAppStore();
  const authStore = useAuthStore();
  const notifyStore = useNotifyStore();

  /**
   * 語系轉換
   */
  const createLocaleListener = () => {
    let cbQueues = [];

    watch(
      () => appStore.locale,
      (locale) => {
        for (let { callback: cb } of cbQueues) {
          cb(locale);
        }
      }
    );

    return (callback) => {
      const randomKey = (Math.random() + 1).toString(36).substring(7);
      cbQueues = [...cbQueues, { key: randomKey, callback }];
      const unRegister = () => {
        cbQueues = reject((queue) => queue.key === randomKey, cbQueues);
      };
      return unRegister;
    };
  };

  /**
   * 使用者登入/登出
   */
  const createLoggedInListener = () => {
    let cbQueues = [];

    watch(
      () => authStore.isLogin,
      (isLogin) => {
        for (let { callback: cb } of cbQueues) {
          cb(isLogin);
        }
      }
    );

    return (callback) => {
      const randomKey = (Math.random() + 1).toString(36).substring(7);
      cbQueues = [...cbQueues, { key: randomKey, callback }];
      const unRegister = () => {
        cbQueues = reject((queue) => queue.key === randomKey, cbQueues);
      };
      return unRegister;
    };
  };

  /**
   * 通知
   */
  const createNotifyListener = () => {
    let cbQueues = {};

    watch(
      () => ({ ...notifyStore.$state }),
      (state, prevState) => {
        for (let stateKey in state) {
          const currentValue = state[stateKey];
          const prevValue = prevState[stateKey];
          if (stateKey in cbQueues && !equals(currentValue, prevValue)) {
            for (let { callback: cb } of cbQueues[stateKey]) {
              cb(currentValue);
            }
          }
        }
      }
    );

    return (typeName, callback) => {
      const randomKey = (Math.random() + 1).toString(36).substring(7);
      if (!(typeName in cbQueues)) {
        cbQueues[typeName] = [];
      }
      cbQueues[typeName] = [
        ...cbQueues[typeName],
        { key: randomKey, callback },
      ];
      const unRegister = () => {
        cbQueues[typeName] = reject(
          (queue) => queue.key === randomKey,
          cbQueues[typeName]
        );
      };
      return unRegister;
    };
  };

  return {
    registerLocale: createLocaleListener(),
    registerLoggedIn: createLoggedInListener(),
    registerNotify: createNotifyListener(),
  };
});
