/**
 * game store 封裝
 */
import { defineWorkflow } from "@/_app/_define";
import { createPassport } from "./common/core/passport";
import {
  exhaustOf,
  whileOnceOf,
  throttleExhaustOf,
  queueOf,
  throttleOf,
} from "./common/core/observers";
import { withPayload } from "./common/core/operators";

/** stores */
import { useAppStore } from "@/store/app-store";
import { useAuthStore } from "@/store/auth-store";
import { useGameStore } from "@/store/game-store";

/** service */
import { useRouterService } from "@/services/router-service";
import { useI18nService } from "@/services/i18n-service";
import { useAlertService } from "@/services/alert-service";
import { useApiService } from "@/services/api-service";

/** workflows */
import { useUniqWorkflow } from "./common/uniq-workflow";
import { usePopupWorkflow } from "./common/popup-workflow";
import { useListenerWorkflow } from "./common/listener-workflow";

/** helper */
import { openUrl } from "@/tool";
import {
  toPairs,
  reject,
  isNil,
  pipe,
  map,
  fromPairs,
  reduce,
  isEmpty,
} from "ramda";

export const useGameWorkflow = defineWorkflow("game-workflow", () => {
  const appStore = useAppStore();
  const authStore = useAuthStore();
  const gameStore = useGameStore();
  const listenerWorkflow = useListenerWorkflow();
  const uniqWorkflow = useUniqWorkflow();
  const popupWorkflow = usePopupWorkflow();
  const router = useRouterService();
  const alertService = useAlertService();
  const apiService = useApiService();
  const i18nService = useI18nService();

  const createGetGamesPassport = () => {
    const passport = createPassport(
      "game.getGames",
      async () => {
        const response = await gameStore.getGames();
        if (response.code === 1) {
          /** 寫入當前語系 */
          i18nService.addMessages(
            appStore.locale,
            reduce(
              (obj, record) => ({
                ...obj,
                [`game.${record.category_code}.${record.platform}.${record.game}`]: record.game_lang,
              }),
              {}
            )(response.data)
          );
        }
        return response;
      }
      //
    );
    const observer = whileOnceOf((response) => response.code === 1)(passport);

    return () => observer.excute();
  };

  const createGetGameLocalesPassport = () => {
    const passport = createPassport(
      "game.getGameLocales",
      async (payload) => {
        const res = await gameStore.getGameLocales({ locale: payload.locale });
        if (!isEmpty(res.data)) {
          /** 將拿到的結果寫入套件 */
          i18nService.addMessages(
            payload.locale,
            pipe(
              reject(isNil),
              toPairs,
              map(([key, value]) => [`game.${key}`, value]),
              fromPairs
            )(res.data)
          );
        }
      }
      //
    ).pipe(
      withPayload()
      //
    );
    const observer = queueOf()(passport);

    return (payload) => {
      passport.call("payload", payload);
      return observer.excute();
    };
  };

  const createManualGetGamesPassport = () => {
    const passport = createPassport(
      "game.manualGetGames",
      async () => {
        const loadingStop = popupWorkflow.loadingStart();
        await getGames();
        loadingStop();
      }
      //
    );
    const observer = throttleExhaustOf(3000)(passport);

    return () => observer.excute();
  };

  const createGetAdditionUrlPassport = () => {
    const passport = createPassport(
      "game.getAdditionUrl",
      gameStore.getAdditionUrl
      //
    );
    const observer = exhaustOf(passport);

    return () => observer.excute();
  };

  const createGetAdditionReceivePassport = () => {
    const passport = createPassport(
      "game.getAdditionReceive",
      gameStore.getAdditionReceive
      //
    );
    const observer = throttleOf(3000)(passport);

    return () => observer.excute();
  };

  const createGetPopularPassport = () => {
    const passport = createPassport(
      "game.getPopular",
      gameStore.getPopular
      //
    );
    const observer = exhaustOf(passport);

    return () => observer.excute();
  };

  const createGetRecentPassport = () => {
    const passport = createPassport(
      "game.getRecent",
      gameStore.getRecent
      //
    );
    const observer = exhaustOf(passport);

    return () => observer.excute();
  };

  /**
   * 進入遊戲流程
   *
   *                    [點擊遊戲]
   *                        ↓
   *                    <是否登入> --- N ---> [導向登入頁]
   *                      Y ↓
   *                  <遊戲是否維修中>  --- Y ---> [彈窗提示遊戲維修中]
   *                      N ↓
   *      ---------->   [鎖定額度] <--------------------------------------------------------------------------------
   *     |                  ↓                                        Y ↑                                        Y ↑
   *     |             <額度鎖定成功> --- N --->  [解鎖額度]  --->  <解鎖額度成功>                                <解鎖額度成功> -- N
   *     |                Y ↓                      ↑                 N ↓                                          ↑          |
   *     |             [取得跳轉網址]                |           [詢問再次解鎖額度] ---> <是否要再次解鎖> --- Y ---> [再次解鎖]      |
   *     |                  |                      |                                    N |                                  |
   *     |                  |                      ----------------------------           ---------------------------------- |
   *     |                  ↓                                               Y  |                                             |
   *     |          <跳轉 res code 為 1> -- N --> <res code 為 -8> -- N --> <res code 為 -6>                                   |
   *     |                Y ↓                         Y ↓                      |                                             ↓
   *     |             [開啟遊戲網址]                 [延遲一秒]                   -- N ----------------------------------> [提示跳轉失敗]
   *     |                                              |
   *     ------------------------------------------------
   *
   */
  const createPlayGamePassport = () => {
    /** 解鎖流程 */
    const unlockFlow = async () => {
      const SUCCESS = true;
      const unlockRes = await authStore.unlockCredit();
      if (unlockRes.code !== 1) {
        const { isConfirmed } = await alertService.confirm({
          title: i18nService.t(`error.code.forward.-1`),
          text: i18nService.t(`error.fetchMyCredit.failed`),
        });
        if (!isConfirmed) {
          return !SUCCESS;
        }

        /** 再解一次 */
        alertService.showLoading();
        const unlockRes = await authStore.unlockCredit();
        alertService.close();
        if (unlockRes.code !== 1) {
          return !SUCCESS;
        }
      }
      return SUCCESS;
    };

    /** 取得跳轉網址流程 */
    const forwardFlow = async (game) => {
      /* 鎖定額度 */
      const lockRes = await authStore.lockCredit({
        platform: game.platform,
        game: game.game,
      });
      if (lockRes.code !== 1) {
        const isUnlockSuccess = await unlockFlow();
        if (!isUnlockSuccess) {
          return { code: -1 };
        } else {
          return forwardFlow(game);
        }
      }

      /* 取跳轉網址 */
      const forwardRes = await apiService.getGameForward({
        platform: game.platform,
        game: game.game,
      });
      switch (forwardRes.code) {
        case -8:
          return new Promise((resolve) => {
            setTimeout(() => {
              forwardFlow(game).then(resolve);
            }, 1000);
          });

        case -6: {
          const isUnlockSuccess = await unlockFlow();
          if (!isUnlockSuccess) {
            return { code: -1 };
          } else {
            return forwardFlow(game);
          }
        }

        default:
          return forwardRes;
      }
    };

    const passport = createPassport(
      "game.playGame",
      async (payload) => {
        const loadingStop = popupWorkflow.loadingStart();

        if (!authStore.isLogin) {
          loadingStop();
          return router.push({
            path: "/login",
            state: { from: "第一層遊戲" },
          });
        }

        const { game } = payload;
        if (game.status === "maintaining") {
          uniqWorkflow.spot(() =>
            alertService.alert({
              title: i18nService.t("app.dialog.system.title2"),
              text: i18nService.t("app.game.maintaining"),
            })
          );
          loadingStop();
          return;
        }

        const forwardRes = await forwardFlow(game);
        if (forwardRes.code !== 1) {
          uniqWorkflow.spot(() =>
            alertService.alert({
              title: i18nService.t("app.dialog.system.title2"),
              text: i18nService.t(`error.code.forward.${forwardRes.code}`),
            })
          );
          loadingStop();
          return;
        }

        openUrl(forwardRes.data.url);
      }
      //
    ).pipe(
      withPayload()
      //
    );
    const observer = exhaustOf(passport);

    return (payload) => {
      passport.call("payload", { game: payload.game });
      return observer.excute();
    };
  };

  const createPlayAdditionPassport = () => {
    const passport = createPassport(
      "game.playAddition",
      async () => {
        const loadingStop = popupWorkflow.loadingStart();

        if (!authStore.isLogin) {
          loadingStop();
          return router.push({
            path: "/login",
            state: { from: "小遊戲" },
          });
        }

        openUrl(await getAdditionUrl());
      }
      //
    );
    const observer = exhaustOf(passport);

    return () => {
      return observer.excute();
    };
  };

  const playGame = createPlayGamePassport();
  const playAddition = createPlayAdditionPassport();
  const getGames = createGetGamesPassport();
  const getGameLocales = createGetGameLocalesPassport();
  const manualGetGames = createManualGetGamesPassport();
  const getAdditionUrl = createGetAdditionUrlPassport();
  const getAdditionReceive = createGetAdditionReceivePassport();
  const getPopular = createGetPopularPassport();
  const getRecent = createGetRecentPassport();

  const initial = () => {
    /** 建立監聽 */
    listenerWorkflow.registerLoggedIn((isLoggedIn) => {
      if (!isLoggedIn) {
        /** 登出時重置 */
        gameStore.$reset();
      }
    });
    /** 語系切換，拿語系包 */
    listenerWorkflow.registerLocale(async (locale) => {
      const loadingStop = popupWorkflow.loadingStart();
      await getGameLocales({ locale });
      loadingStop();
    });
    /** 奇遇彈窗->重取小遊戲次數 */
    listenerWorkflow.registerNotify("addition_adventure", (has) => {
      if (has) {
        getAdditionReceive();
      }
    });
  };

  return {
    initial,
    playGame,
    playAddition,
    getGames,
    manualGetGames,
    getAdditionUrl,
    getAdditionReceive,
    getPopular,
    getRecent,
  };
});
