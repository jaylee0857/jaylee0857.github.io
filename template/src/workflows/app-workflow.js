import { defineWorkflow } from "@/_app/_define";
import { createPassport } from "./common/core/passport";
import { whileOnceOf, onceOf, queueOf } from "./common/core/observers";

/** stores */
import { useAppStore } from "@/store/app-store";

/** services */
import { useI18nService } from "@/services/i18n-service";

/** sprites */
import accountSprites from "@/assets/images/$sprites/account.png";

/** workers */
import PreloadWorker from "@/workers/preload-worker?worker";

/** helper */
import { getPromoteCode } from "@/_lib/promote-direct";

export const useAppWorkflow = defineWorkflow("app-workflow", () => {
  const appStore = useAppStore();
  const i18nService = useI18nService();

  /** 寫入語系 */
  const setLocale = () => {
    if (appStore.locale) {
      /**
       * ! PLEASE DO NOT DELETE
       * 這段是處理舊代碼轉換成新代碼
       * 今天是 07/10 部署上正式站之後讓他飛個三個月再移除
       */
      const toCurrentSysCode =
        {
          "zh-tw": "tw",
          vi: "vn",
          en: "en",
          "en-ph": "ph",
          tw: "tw",
          ph: "ph",
          vn: "vn",
        }[appStore.locale] ?? import.meta.env.VITE_LOCALE;

      i18nService.setLocale(toCurrentSysCode);
      return;
    }

    // 偵測使用者所在地區來去判斷語言
    let userLang =
      navigator.language?.toLowerCase() ??
      navigator.userLanguage?.toLowerCase() ??
      null;

    /**
     * 轉換成系統值
     * 參考：https://blog.csdn.net/aiyun20/article/details/17026141
     */
    switch (true) {
      case userLang.startsWith("zh"):
        userLang = "tw";
        break;
      case userLang.startsWith("en"):
        userLang = "en";
        break;
      case userLang.startsWith("vi"):
        userLang = "vn";
        break;
      case userLang.startsWith("fil"):
        userLang = "ph";
        break;
      default:
        userLang = import.meta.env.VITE_LOCALE;
        break;
    }

    i18nService.setLocale(userLang);
  };

  /** 寫入推廣碼 */
  const setPromoteCode = () => {
    const code = getPromoteCode();
    if (code) appStore.setPromoteCode(code);
  };

  const createGetDownloadUrlPassport = () => {
    const passport = createPassport(
      "app.getDownloadUrl",
      appStore.getDownloadUrl
      //
    );
    const observer = whileOnceOf((response) => response.code === 1)(passport);

    return () => observer.excute();
  };

  const createGetServiceUrlPassport = () => {
    const passport = createPassport(
      "app.getServiceUrl",
      appStore.getServiceUrl
      //
    );
    const observer = onceOf(passport);

    return () => observer.excute();
  };

  /** 預載精靈圖 */
  const preloadSprites = () => {
    return new Promise((resolve) => {
      const preloadWorker = new PreloadWorker();
      preloadWorker.addEventListener(
        "message",
        (payload) => {
          resolve(payload.data);
        },
        { once: true }
      );
      preloadWorker.postMessage({
        origin: new URL("/", import.meta.url).href,
        files: [accountSprites],
      });
    });
  };

  const createGetUserIPPassport = () => {
    const passport = createPassport(
      "app.getUserIP",
      async () => {
        const ip = await appStore.getUserIP();
        if (!ip) {
          getUserIP();
        }
      }
      //
    );

    const observer = queueOf(5000)(passport);

    return () => observer.excute();
  };

  const getDownloadUrl = createGetDownloadUrlPassport();
  const getServiceUrl = createGetServiceUrlPassport();
  const getUserIP = createGetUserIPPassport();

  const initial = () => {
    setLocale();
    getServiceUrl();
    setPromoteCode();
    preloadSprites();
    getUserIP();
  };

  return {
    initial,
    getDownloadUrl,
    getServiceUrl,
  };
});
