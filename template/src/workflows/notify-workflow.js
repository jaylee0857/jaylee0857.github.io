/**
 * notify-store 封裝
 */
import { defineWorkflow } from "@/_app/_define";
import { createPassport } from "./common/core/passport";
import { withPayload } from "./common/core/operators";
import { mergeOf, throttleOf } from "./common/core/observers";

/** stores */
import { useAppStore } from "@/store/app-store";
import { useNotifyStore } from "@/store/notify-store";
import { useGameStore } from "@/store/game-store";

/** services */
import { useI18nService } from "@/services/i18n-service";
import { useRouterService } from "@/services/router-service";

/** workflows */
import { usePopupWorkflow } from "./common/popup-workflow";
import { useListenerWorkflow } from "./common/listener-workflow";
import { usePollingWorkflow } from "./common/polling-workflow";
import { useAuthWorkflow } from "./auth-workflow";
import { useGameWorkflow } from "./game-workflow";

/** components */
import VipContentModal from "@/widgets/popup/home/vip-content.vue";
import GiftContentModal from "@/widgets/popup/home/gift-content.vue";
import SurpriseMeetModal from "@/widgets/popup/home/surprise-meet";

/** helper */
import { split, last } from "ramda";
import { openUrl } from "@/tool";

export const useNotifyWorkflow = defineWorkflow("notify-workflow", () => {
  const appStore = useAppStore();
  const notifyStore = useNotifyStore();
  const gameStore = useGameStore();
  const i18nService = useI18nService();
  const routerService = useRouterService();
  const popupWorkflow = usePopupWorkflow();
  const listenerWorkflow = useListenerWorkflow();
  const pollingWorkflow = usePollingWorkflow();
  const authWorkflow = useAuthWorkflow();
  const gameWorkflow = useGameWorkflow();

  const createPostNotifyPassport = () => {
    const passport = createPassport(
      "notify.postNotify",
      notifyStore.readNotify
    ).pipe(
      withPayload()
      //
    );
    const observer = mergeOf(passport);

    /** 回傳 */
    return (payload) => {
      /** 傳送 payload */
      passport.call("payload", payload);

      return observer.excute();
    };
  };

  const createGetNotifyPassport = () => {
    const passport = createPassport(
      "notify.getNotify",
      notifyStore.getNotify
      //
    );
    /** 3 秒內重複請求都拿到最後一次回傳值 */
    const observer = throttleOf(3000)(passport);

    return () => observer.excute();
  };

  const initial = () => {
    const { t } = i18nService;
    let pollingStop;
    listenerWorkflow.registerLoggedIn((isLoggedIn) => {
      if (isLoggedIn) {
        /** 一登入就標記已拿公告 */
        postNotify({ type: "news" });
        /** 輪詢拿通知 */
        pollingStop = pollingWorkflow.pollingStart(getNotify, 30000);
      } else {
        pollingStop?.();
        /** 登出時重置紅點 */
        notifyStore.$reset();
      }
    });
    listenerWorkflow.registerNotify("news", (hasNews) => {
      if (hasNews) {
        postNotify({ type: "news" });
      }
    });
    listenerWorkflow.registerNotify("vip", (hasVip) => {
      if (hasVip) {
        popupWorkflow
          .vip({
            component: VipContentModal,
            props: {
              title: t("pages.home.notify.vip.title"),
              text: t(`pages.account.link.member.title.${hasVip.msg}`),
              level: hasVip.msg,
            },
          })
          .then(() => {
            postNotify({ type: "vip" });
          });
      }
    });
    listenerWorkflow.registerNotify("withdraw", (hasWithdraw) => {
      if (hasWithdraw) {
        switch (hasWithdraw.msg) {
          case "success":
            popupWorkflow
              .alert({
                title: t("app.dialog.system.title2"),
                text: t("pages.withdraw.feedback.complete"),
              })
              .then(() => {
                postNotify({ type: "withdraw" });
              });
            break;
          case "fail":
            popupWorkflow
              .alert({
                title: t("app.dialog.system.title2"),
                text: [
                  t("pages.withdraw.feedback.complete.fail.title"),
                  t("pages.withdraw.feedback.complete.fail"),
                ].toString(),
              })
              .then(() => {
                postNotify({ type: "withdraw" });
              });
            break;
          default:
            postNotify({ type: "withdraw" });
            break;
        }
      }
    });
    listenerWorkflow.registerNotify("lose_stat", (hasLoseStat) => {
      if (hasLoseStat) {
        popupWorkflow
          .gift({
            component: GiftContentModal,
            props: {
              text: t("pages.home.notify.losed.title"),
              lang: appStore.locale,
            },
          })
          .then(() => {
            postNotify({ type: "lose_stat" });
            routerService.push("/discount");
          });
      }
    });
    listenerWorkflow.registerNotify("addition", (hasAddition) => {
      if (hasAddition) {
        postNotify({ type: "addition" });
      }
    });
    listenerWorkflow.registerNotify("addition_adventure", async (has) => {
      if (has) {
        /**
         * 在首頁一開始不跳，首頁有自己的popupFlow
         * router抓不到path
         */
        const currentPath = last(split("/", document.location.href));
        if (currentPath === "home" && !notifyStore.hasHomePopupFlow) return;

        await gameWorkflow.getAdditionReceive();
        if (gameStore.redPacket?.receive_left) {
          const tempMsg = notifyStore.addition_adventure.msg;
          await postNotify({ type: "addition_adventure" });
          popupWorkflow
            .surprise({
              component: SurpriseMeetModal,
              props: {
                text: tempMsg,
              },
            })
            .then(({ isConfirmed }) => {
              if (isConfirmed) {
                gameWorkflow.getAdditionUrl().then((bouyUrl) => {
                  authWorkflow.updateNoviceTask({ type: "isEnteredAddition" });
                  openUrl(bouyUrl);
                });
              }
            });
        }
      }
    });
  };

  const postNotify = createPostNotifyPassport();
  const getNotify = createGetNotifyPassport();

  return {
    initial,
    postNotify,
    getNotify,
  };
});
