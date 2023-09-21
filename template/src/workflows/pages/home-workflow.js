import { defineWorkflow } from "@/_app/_define";

/** stores */
import { useBulletinStore } from "@/store/bulletin-store";
import { useAuthStore } from "@/store/auth-store";
import { useGameStore } from "@/store/game-store";
import { usePopupStore } from "@/store/popup-store";
import { useNotifyStore } from "@/store/notify-store";

/** services */
import { useI18nService } from "@/services/i18n-service";
import { useAlertService } from "@/services/alert-service";
import { useRouterService } from "@/services/router-service";

/** workflows */
import { useUniqWorkflow } from "../common/uniq-workflow";
import { usePopupWorkflow } from "../common/popup-workflow";
import { useAuthWorkflow } from "../auth-workflow";
import { useBannerWorkflow } from "../banner-workflow";
import { useGameWorkflow } from "../game-workflow";
import { useBulletinWorkflow } from "../bulletin-workflow";
import { useNotifyWorkflow } from "../notify-workflow";

/** components */
import NewsModal from "@/widgets/popup/home/news-list";
import LimitContentModal from "@/widgets/popup/home/limit-content";
import SurpriseMeetModal from "@/widgets/popup/home/surprise-meet";

/** helper */
import { openUrl } from "@/tool";

export const useHomeWorkflow = defineWorkflow("home-workflow", () => {
  const authStore = useAuthStore();
  const gameStore = useGameStore();
  const bulletinStore = useBulletinStore();
  const popupStore = usePopupStore();
  const notifyStore = useNotifyStore();
  const { t } = useI18nService();
  const alertService = useAlertService();
  const routerService = useRouterService();
  const uniqWorkflow = useUniqWorkflow();
  const popupWorkflow = usePopupWorkflow();
  const authWorkflow = useAuthWorkflow();
  const bannerWorkflow = useBannerWorkflow();
  const gameWorkflow = useGameWorkflow();
  const bulletinWorkflow = useBulletinWorkflow();
  const notifyWorkflow = useNotifyWorkflow();
  let isFirstEnter = true;

  /** 限時 */
  const limitedsHandler = async (limiteds) => {
    /** 每次顯示第一筆 */
    const data = limiteds[0];
    if (data) {
      const { isConfirmed, result } = await popupStore.limit({
        component: LimitContentModal,
        timer: data.read_lock_sec * 1000,
        props: {
          setting: {
            id: data.id,
            title: data.title,
            content: data.content,
            read_lock: data.read_lock,
            attach: new URL(data.attach, import.meta.env.VITE_REMOTE_IMAGES),
          },
        },
      });
      if (isConfirmed) {
        /** 點擊確認按鈕 */
        bulletinWorkflow.updateLimited({
          id: data.id, //活動id
          read_lock: result.status, //是否不再提示 後端不會再回傳
        });
      }
      /** 標示這次看過了，重整或重新打開才會跳 */
      bulletinStore.markLimitedRead();
    }
  };

  /* 通知 */
  const unreadBulltinNotify = async (list) => {
    await popupStore.news({
      component: NewsModal,
      title: t("pages.home.welcome.title"),
      props: {
        list,
      },
    });
    bulletinStore.readAllMessages();
  };

  /** 提示洗碼量達標即可申請提款 */
  const judgeToWithdrawModal = async () => {
    const { isConfirmed } = await alertService.confirm({
      title: t("app.alert.title.importent"),
      text: t("app.withdraw.to"),
      confirmButtonText: t("button.to"),
    });
    await authWorkflow.updateNoviceTask({ type: "isConfirmedToWithdraw" });
    if (isConfirmed) {
      routerService.push("/withdraw");
    }
  };

  /** 新手提示/每日提示  */
  const bouyGameTip = async ({ isOld }) => {
    return alertService.confirm({
      title: t("app.alert.title.discount"),
      text: t(`app.bouy.${isOld ? "old" : "new"}member`, {
        quanitity: gameStore.redPacket?.receive_left ?? "",
      }),
      confirmButtonText: t("button.to"),
    });
  };

  /** 進入小遊戲 */
  const enterAddition = async () => {
    const bouyUrl = await gameWorkflow.getAdditionUrl();
    if (bouyUrl) {
      await authWorkflow.updateNoviceTask({ type: "isEnteredAddition" });
      openUrl(bouyUrl);
    }
  };

  const popupFlow = () => {
    /**
     * 彈窗順序 ( 和app流程不同 )
     * -1. 新手提示 (小遊戲) or 新手提示 (提款)
     * 0. 奇遇 or 每日提示 (小遊戲)
     * 1. 限時活動
     * 2. 公告
     */
    return new Promise((resolve) => {
      (async () => {
        /** 進入過小遊戲 */
        const isEnteredAddition = authStore.isEnteredAddition === 1;
        /** 小遊戲 "剩餘" 遊玩次數 */
        const hasAdditionReceive = gameStore.redPacket?.receive_left > 0;

        switch (true) {
          /** -1. 新手提示 (小遊戲) */
          /** 沒跑過新手流程，沒進入過小遊戲，小遊戲有遊玩次數 */
          case !authStore.isOldBird &&
            !isEnteredAddition &&
            hasAdditionReceive: {
            const { isConfirmed } = await bouyGameTip({ isOld: false });
            if (isConfirmed) {
              await authWorkflow.updateNoviceTask({ type: "isOldBird" });
              enterAddition();
            }
            break;
          }
          /** -1. 新手提示 (提款) */
          /** 進入過小遊戲，沒進入過提款，未彈出提款視窗 */
          case isEnteredAddition &&
            !authStore.isEnteredWithdraw &&
            !authStore.isConfirmedToWithdraw:
            await judgeToWithdrawModal();
            break;
        }

        switch (true) {
          /** 0. 奇遇 */
          case !!notifyStore.addition_adventure: {
            if (hasAdditionReceive) {
              const tempMsg = notifyStore.addition_adventure.msg;
              await notifyWorkflow.postNotify({ type: "addition_adventure" });
              const { isConfirmed } = await popupStore.surprise({
                component: SurpriseMeetModal,
                props: {
                  text: tempMsg,
                },
              });
              if (isConfirmed) enterAddition();
            }
            break;
          }
          /** 0. 每日提示 */
          /** 進入過小遊戲，小遊戲有遊玩次數，今天還沒看過每日提示 */
          case isEnteredAddition &&
            hasAdditionReceive &&
            !authStore.isDailyHintRead: {
            authStore.markDailyHintRead();
            const { isConfirmed } = await bouyGameTip({ isOld: true });
            if (isConfirmed) enterAddition();
            break;
          }
        }

        /** 1. 限時活動 */
        if (
          !bulletinStore.isLimitedReadThisTime &&
          bulletinStore.limiteds.length > 0
        ) {
          await limitedsHandler(bulletinStore.limiteds);
        }

        /** 2. 公告 */
        if (bulletinStore.unreadMessages.length !== 0) {
          await unreadBulltinNotify(bulletinStore.unreadMessages);
        }

        /** 回報流程結束 */
        notifyStore.homePopupFlowState();
        resolve();
      })();
    });
  };

  const created = async () => {
    const loadingStop = popupWorkflow.loadingStart();

    /** 畫面所需資料 */
    await authWorkflow.getUser();
    bannerWorkflow.getBanner();
    bulletinWorkflow.getBulletin();
    bulletinWorkflow.getWithdraw();

    if (isFirstEnter) {
      /** 首次進入撈全部遊戲 */
      isFirstEnter = false;
      await gameWorkflow.getGames();
    } else {
      /** 之後只需要撈熱門跟最近 */
      gameWorkflow.getPopular();
      if (authStore.isLogin) {
        gameWorkflow.getRecent();
      }
    }

    /** 已登入流程 */
    if (authStore.isLogin) {
      await Promise.all([
        gameWorkflow.getAdditionReceive(),
        authWorkflow.getNoviceTask(),
      ]);

      uniqWorkflow.spot(popupFlow);
    }

    /** 關閉 loading */
    loadingStop();
  };

  return {
    created,
  };
});
