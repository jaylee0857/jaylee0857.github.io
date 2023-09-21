import { defineWorkflow } from "@/_app/_define";

/** stores */
import { useAuthStore } from "@/store/auth-store";
import { usePaymentStore } from "@/store/payment-store";
import { useAppStore } from "@/store/app-store";
import { useNotifyStore } from "@/store/notify-store";

/** services */
import { useRouterService } from "@/services/router-service";
import { useI18nService } from "@/services/i18n-service";
import { useRiveService } from "@/services/rive-service";

/** workflows */
import { useAuthWorkflow } from "@/workflows/auth-workflow";
import { usePopupWorkflow } from "@/workflows/common/popup-workflow";
import { useNotifyWorkflow } from "@/workflows/notify-workflow";
import { usePaymentWorkflow } from "../payment-workflow";

/** components */
import Giveaway from "@/widgets/popup/withdraw/giveaway-content.vue";
import GiveawayImg from "@/widgets/popup/withdraw/giveaway-content-img.vue";

/** helper */
import { forEach, values } from "ramda";
import { add, differenceInHours } from "date-fns";
import $ from "jquery";
import gsap from "gsap";

const BOX_STAGE = {
  OPENED: 1,
  DEFAULT: 2,
  SHAKE: 3,
  SHINE: 4,
};

const ACTIVITY_STAGE = {
  UN_ACTIVE: 1 /** 未激活 */,
  ACTIVED: 2 /** 已激活 */,
  ACHIEVED: 3 /** 已達成 */,
  RECEIVED: 4 /** 已領取 */,
};

const EFFECT_STAGE = {
  WAITING: 0,
  RECEIVE: 1,
  RESULT: 2,
  CLOSE: 3,
  DONE: 4,
};

export const useWithdrawWorkflow = defineWorkflow("withdraw-workflow", () => {
  const routerService = useRouterService();
  const riveService = useRiveService();
  const { t } = useI18nService();
  const appStore = useAppStore();
  const notifyStore = useNotifyStore();
  const authStore = useAuthStore();
  const paymentStore = usePaymentStore();
  const popupWorkflow = usePopupWorkflow();
  const authWorkflow = useAuthWorkflow();
  const notifyWorkflow = useNotifyWorkflow();
  const paymentWorkflow = usePaymentWorkflow();
  // const uniqWorkflow = useUniqWorkflow();

  let boxRive, effectRive;

  /** 檢查電話綁定 */
  const _validPhone = async () => {
    if (authStore.user.phone) return true;

    const { isConfirmed } = await popupWorkflow.confirm({
      title: t("app.dialog.setphone.title"),
      text: t("app.dialog.setphone.text"),
    });
    if (isConfirmed) {
      routerService.push("/account/phone");
      return false;
    }
    return true;
  };

  /** 彈窗 */
  const _popupGiveaway = async ({ title = null } = {}) => {
    return popupWorkflow.giveaway({
      component: boxRive ? Giveaway : GiveawayImg,
      props: {
        btnText: `
        <span>${t("pages.withdraw.prize.condition.title")}</span>
        <span>${t("pages.withdraw.prize.condition.withdraw")}</span>
        <span>${t("pages.withdraw.prize.condition.topup", {
          num: paymentStore.activity?.deposit_count_limit ?? 0,
        })}</span>`,
        reciprocal: title ?? t("pages.withdraw.prize.title"),
      },
    });
  };

  /** 領取後的彈窗 */
  const _popupReceived = async ({ btnText }) => {
    return popupWorkflow.giveaway({
      component: boxRive ? Giveaway : GiveawayImg,
      props: {
        isOpen: true,
        btnText,
      },
    });
  };

  /**
   * 篩出屬於提款的type並進行已讀
   */
  const _updateNotifyStatus = () => {
    const isHadNotify = notifyStore.isTip("activity_deposit_withdraw");
    if (!isHadNotify) return;

    const notifyMap = notifyStore.pickNotify([
      "wash_amount_complete",
      "activity_wash_amount",
      "activity_deposit_withdraw",
    ]);
    forEach((notify) => {
      notifyWorkflow.postNotify({ type: notify.type, msg: notify.msg });
    }, values(notifyMap));
  };

  /**
   * ==================================================
   * 支援動畫的流程
   * ==================================================
   */
  const _onRiveException = (boxRef) => {
    /** 失敗後強制設定為關閉動畫 */
    appStore.setAnimationSwitch(false);
    cleanUpSources();
    setTimeout(() => {
      /** 更新圖片來源 */
      updateBoxStage(boxRef);
    }, 100);
  };

  const prepareBoxSource = async (boxRef) => {
    try {
      boxRive = await riveService.create({
        canvas: boxRef.value,
        src: new URL("../../assets/video/chest_v5.riv", import.meta.url).href,
        autoplay: true,
        stateMachines: "Chest",
      });
      boxRive.instance.resizeDrawingSurfaceToCanvas();

      boxRive.onStageChanged((stage) => {
        if (stage === BOX_STAGE.SHAKE && !effectRive) {
          prepareEffectRiveSource(boxRef);
        }
      });

      updateBoxStage(boxRef);
    } catch (error) {
      _onRiveException(boxRef);
    }
  };

  const _createEffectElements = () => {
    if ($(".box-effect").length) {
      $(".box-effect").first().remove();
    }

    const canvas = $("<canvas>").css("width", 900).data("step", 1);

    const btnText = $("<div>").addClass("box-effect__btn-text");

    const btnOuter = $("<div>").addClass("box-effect__btn-outer").html(btnText);

    const effectGroup = $("<div>")
      .addClass("box-effect box-effect--hide")
      .css("opacity", 0)
      .html([canvas, btnOuter])
      .appendTo("#app");

    return {
      effectGroup,
      canvas,
      btnText,
      btnOuter,
    };
  };

  /**
   * 準備領獎特效 Rive
   */
  const prepareEffectRiveSource = async (boxRef) => {
    try {
      const {
        effectGroup,
        canvas,
        btnText,
        btnOuter,
      } = _createEffectElements();
      effectRive = await riveService.create({
        canvas: canvas.get(0),
        src: new URL("../../assets/video/chest_open.riv", import.meta.url).href,
        autoplay: true,
        stateMachines: "State Machine 1",
        onLoad() {
          canvas.ready(() => {
            btnOuter.css("height", `${canvas.height()}px`);
          });

          /**
           * effect 點擊事件
           */
          effectGroup.on("click", () => {
            switch (effectRive.stages.value) {
              case EFFECT_STAGE.WAITING:
              case EFFECT_STAGE.RESULT:
              case EFFECT_STAGE.DONE:
                /** 不給按 */
                return;
              case EFFECT_STAGE.RECEIVE:
                paymentWorkflow.postPaymentReceive().then((response) => {
                  effectRive.fire({ receiveRes: response });
                });
                return;
              case EFFECT_STAGE.CLOSE:
                effectRive.fire();
                return;
            }
          });
        },
      });

      const dropEffectAudio = new Audio(
        new URL("../../assets/sound/chest_drop.mp3", import.meta.url).href
      );
      const openEffectAudio = new Audio(
        new URL("../../assets/sound/chest_open.mp3", import.meta.url).href
      );

      effectRive.instance.resizeDrawingSurfaceToCanvas();
      effectRive.onStageChanged((stage, ctx) => {
        switch (stage) {
          case EFFECT_STAGE.WAITING:
            break;

          case EFFECT_STAGE.RECEIVE:
            effectRive.play();
            effectGroup.removeClass("box-effect--hide");
            btnText
              .css("bottom", canvas.height() * 0.065)
              .html(t("pages.withdraw.prize.btn"));
            gsap.to(effectGroup.get(0), {
              opacity: 1,
              duration: 0.3,
            });
            break;

          case EFFECT_STAGE.RESULT:
            dropEffectAudio.play();
            btnText.css("opacity", 0).css("bottom", canvas.height() * 0.25);
            ctx.receiveCallback(ctx.receiveRes);
            if (ctx.receiveRes.code === 1) {
              btnText.html(
                t("pages.withdraw.prize.award", {
                  num: ctx.receiveRes.data.give_amount,
                })
              );
            } else {
              btnText.html(
                t(`error.code.withdraw.receive.${ctx.receiveRes.code}`)
              );
            }

            gsap.to(btnText.get(0), {
              delay: 1.35,
              opacity: 1,
              duration: 0.3,
              onStart() {
                openEffectAudio.play();
              },
              onComplete() {
                effectRive.setStage(3);
              },
            });
            break;

          case EFFECT_STAGE.CLOSE: {
            const btnClose = $("<div>")
              .addClass("box-effect__btn-close text-28")
              .css({
                position: "absolute",
                left: 0,
                right: 0,
                bottom: canvas.height() * 0.065,
                color: "#A4A4A4",
                opacity: 0,
              })
              .html(t("button.outsideclose"))
              .appendTo(btnOuter);

            gsap.to(btnClose.get(0), {
              opacity: 1,
              duration: 0.3,
            });
            break;
          }

          case EFFECT_STAGE.DONE:
            /** done */
            gsap.to(effectGroup.get(0), {
              opacity: 0,
              duration: 0.3,
            });
            effectGroup.addClass("box-effect--hide");
            effectRive.reset();
            $(".box-effect__btn-close").remove();
            break;
        }
      });
    } catch (error) {
      _onRiveException(boxRef);
    }
  };

  const cleanUpSources = () => {
    boxRive?.cleanup();
    boxRive = null;
    effectRive?.cleanup();
    effectRive = null;
  };

  /**
   * ==================================================
   * 不支援動畫的流程
   * ==================================================
   */
  const setBoxImageStage = (boxRef) => (stage) => {
    const target = $(boxRef.value);
    /** 移除動畫 */
    target.data("animate")?.kill();
    /** 寫入階段 */
    target.data("stage", stage);

    switch (stage) {
      case BOX_STAGE.OPENED:
      case BOX_STAGE.DEFAULT:
        target.attr(
          "src",
          new URL(
            "../../assets/images/withdraw/img_close_chest_box.png",
            import.meta.url
          ).href
        );
        break;
      case BOX_STAGE.SHAKE: {
        /** shake effect */
        const shakeTL = gsap.timeline({
          yoyo: true,
          repeat: -1,
          repeatDelay: 0.65,
        });
        shakeTL.to(boxRef.value, {
          rotation: 15,
          duration: 0.08,
        });
        shakeTL.to(boxRef.value, {
          rotation: -15,
          duration: 0.08,
        });
        shakeTL.to(boxRef.value, {
          rotation: 15,
          duration: 0.08,
        });
        shakeTL.to(boxRef.value, {
          rotation: -15,
          duration: 0.08,
        });
        shakeTL.to(boxRef.value, {
          rotation: 0,
          duration: 0.08,
        });
        target
          .data("animate", shakeTL)
          .attr(
            "src",
            new URL(
              "../../assets/images/withdraw/img_close_chest_box.png",
              import.meta.url
            ).href
          );
        break;
      }
      case BOX_STAGE.SHINE:
        target.attr(
          "src",
          new URL(
            "../../assets/images/withdraw/img_open_chest_box.png",
            import.meta.url
          ).href
        );
        break;
    }
  };

  /**
   * ==================================================
   * 操作與共用封裝
   * ==================================================
   */
  const created = async () => {
    if (!(await _validPhone())) return;
    const loadingStop = popupWorkflow.loadingStart();

    await Promise.all([
      authWorkflow.getUser(),
      authWorkflow.getNoviceTask(),
      paymentStore.getChannels(),
      paymentStore.getActivity(),
      paymentWorkflow.getWashAmount(),
    ]);

    if (!paymentStore.channel || !paymentStore.washAmount) {
      /** 沒有付款方式 || 沒有出款洗碼量 */
      popupWorkflow.alert({
        title: t("app.dialog.system.title"),
        text: t("pages.trade.empty.trade"),
        willClose: () => {
          routerService.back();
        },
      });
    }

    /** 新手提示 */
    if (paymentStore.activity) {
      /** 有活動 */
      if (authStore.isEnteredWithdraw === 0) {
        /** 首次進入取款頁，還不能領寶箱 */
        if (paymentStore.activity.stage !== ACTIVITY_STAGE.ACHIEVED) {
          /** 自動觸發新手引導 */
          _popupGiveaway();
        }
        authWorkflow.updateNoviceTask({ type: "isEnteredWithdraw" });
      }
    }

    loadingStop();

    /** 不影響邏輯順序的就擺後面背景處理 */
    paymentWorkflow.getBankbooks();
    _updateNotifyStatus();
  };

  /** 領獎 */
  const onReceive = (boxRef) => {
    const callback = (response) => {
      if (response.code === 1) {
        // 更新活動
        paymentStore.getActivity().then(() => {
          updateBoxStage(boxRef);
        });
        authWorkflow.getUser();
      }
    };

    if (boxRive) {
      effectRive.setStage(1, { receiveCallback: callback });
    } else {
      paymentWorkflow.postPaymentReceive().then((response) => {
        callback(response);

        if (response.code === 1) {
          _popupReceived({
            btnText: t("pages.withdraw.prize.award", {
              num: response.data.give_amount,
            }),
          });
        } else {
          _popupReceived({
            btnText: t(`error.code.withdraw.receive.${response.code}`),
          });
        }
      });
    }
  };

  /** 寶箱點擊 */
  const onBoxClick = (boxRef) => {
    const boxStage = boxRive?.stages.value ?? $(boxRef.value).data("stage");

    switch (boxStage) {
      case BOX_STAGE.SHAKE:
        /** 領獎囉 */
        onReceive(boxRef);
        break;

      case BOX_STAGE.SHINE:
        /** 提示：提款成功即可重置寶箱 */
        _popupGiveaway({
          title: t("pages.withdraw.prize.reset.withdraw"),
        });
        break;

      case BOX_STAGE.OPENED: {
        /** 提示剩餘時間 */
        if (authStore.washAmount?.cool_down_start_at) {
          const diff = differenceInHours(
            add(new Date(authStore.washAmount.cool_down_start_at), {
              days: authStore.washAmount.cool_down_days_limit,
            }),
            new Date()
          );
          if (diff > 0) {
            const title = t("pages.withdraw.prize.cooldown", {
              day: ~~(diff / 24),
              hour: diff % 24,
            });
            _popupGiveaway({ title });
            return;
          }
        }

        /** 沒有剩餘時間就預設內容 */
        _popupGiveaway();
        break;
      }

      case BOX_STAGE.DEFAULT:
        _popupGiveaway();
        break;
    }
  };

  /* 更新寶箱階段 */
  const updateBoxStage = (boxRef) => {
    const setStage =
      boxRive?.setStage.bind(boxRive) ?? setBoxImageStage(boxRef);

    const {
      stage: activityStage,
      is_never_joined: isNeverJoined,
    } = paymentStore.activity;

    switch (true) {
      case isNeverJoined && activityStage === ACTIVITY_STAGE.UN_ACTIVE:
        /** 首次參加但是未激活 */
        setStage(BOX_STAGE.DEFAULT);
        break;

      default:
        /** 預設活動狀態等於寶箱狀態 */
        setStage(activityStage);
        break;
    }
  };

  /**
   * 取款送出
   * @param {Object} payload
   * @return {Promise}
   */
  const onSubmit = async (payload) => {
    const currentCredit = authStore.user.credit ?? 0;
    /** 餘額不足 */
    if (payload.amount > currentCredit) {
      return popupWorkflow.alert({
        title: t("app.dialog.system.title"),
        text: t("error.code.withdraw.-3"),
      });
    }

    /** 計算中 */
    if (paymentStore.washAmount?.on_calculate) {
      return popupWorkflow.toast(t("pages.withdraw.bet.calculating"));
    }

    /** 洗碼量未達標 */
    if (!paymentStore.washAmount?.has_complete) {
      return popupWorkflow.alert({
        title: t("pages.withdraw.bet.submit.fail.title"),
        text: t("pages.withdraw.bet.submit.fail"),
      });
    }

    const loadingStop = popupWorkflow.loadingStart();
    const res = await paymentWorkflow.postWithdraw({
      accountId: paymentStore.bankCard.id,
      amount: payload.amount,
    });
    loadingStop();
    if (res.code !== 1) {
      return popupWorkflow.alert({
        title: t("app.dialog.system.title"),
        text: t(`error.code.withdraw.${res.code}`),
      });
    }

    //更新餘額
    authStore.getUser();

    // 提示成功
    popupWorkflow.alert({
      title: t("app.dialog.system.title"),
      text: t("pages.withdraw.feedback.success"),
    });
  };

  return {
    created,
    prepareBoxSource,
    cleanUpSources,
    updateBoxStage,
    onBoxClick,
    onSubmit,
  };
});
