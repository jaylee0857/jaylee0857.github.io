/**
 * 所有彈窗封裝
 */
import { defineWorkflow } from "@/_app/_define";

/** stores */
import { usePopupStore } from "@/store/popup-store";

/** services */
import { useAlertService } from "@/services/alert-service";

/** workflows */
import { useUniqWorkflow } from "./uniq-workflow";

/** helper */
import { uniq } from "ramda";

export const usePopupWorkflow = defineWorkflow("popup-workflow", () => {
  const uniqWorkflow = useUniqWorkflow();
  const alertService = useAlertService();
  const popupStore = usePopupStore();

  /**
   * Loading 封裝
   */
  const createLoadingPassport = () => {
    let isRunning = false;
    let _runningQueues = [];
    let _doneQueues = [];
    let stopEmitter;

    const start = () => {
      if (_runningQueues.length === 0) {
        return Promise.resolve("done");
      }
      alertService.showLoading();
      return new Promise((resolve) => {
        stopEmitter = resolve;
      });
    };

    const stop = () => {
      if (!stopEmitter) throw Error("Loading 未啟動，請檢查流程是否正確");

      alertService.close();
      _runningQueues = [];
      _doneQueues = [];
      isRunning = false;
      stopEmitter();
    };

    return {
      loadingStart() {
        const randomKey = (Math.random() + 1).toString(36).substring(7);
        _runningQueues = [..._runningQueues, randomKey];

        if (!isRunning) {
          isRunning = true;
          uniqWorkflow.queue(start);
        }

        const loadingStop = (delay = 0) => {
          setTimeout(() => {
            _doneQueues = uniq([..._doneQueues, randomKey]);
            if (_doneQueues.length === _runningQueues.length) {
              stop();
            }
          }, delay);
        };

        return loadingStop;
      },

      forceStopLoading() {
        stop();
      },
    };
  };
  const { loadingStart, forceStopLoading } = createLoadingPassport();

  /**
   * alert-service 封裝
   *
   * @TODO
   * 將以下三隻整合進 popup-store
   * 使用自訂元件配合 GSAP 優化彈窗特效
   *
   * @TARGET
   * alert-service 只保留 loading 操作
   * 讓彈窗與 Loading Effect 獨立
   */
  const toast = async (title) => {
    return new Promise((resolve) => {
      uniqWorkflow.queue(() => {
        return alertService.toast(title).then(resolve);
      });
    });
  };
  const alert = async (payload) => {
    return new Promise((resolve) => {
      uniqWorkflow.queue(() => {
        return alertService.alert(payload).then(resolve);
      });
    });
  };
  const confirm = async (payload) => {
    return new Promise((resolve) => {
      uniqWorkflow.queue(() => {
        return alertService.confirm(payload).then(resolve);
      });
    });
  };

  /**
   * popup-store 封裝
   */
  const modal = async (payload) => {
    return new Promise((resolve) => {
      uniqWorkflow.queue(async () => {
        resolve(await popupStore.modal(payload));
      });
    });
  };
  const rank = async (payload) => {
    return new Promise((resolve) => {
      uniqWorkflow.queue(async () => {
        resolve(await popupStore.rank(payload));
      });
    });
  };
  const news = async (payload) => {
    return new Promise((resolve) => {
      uniqWorkflow.queue(async () => {
        resolve(await popupStore.news(payload));
      });
    });
  };
  const limit = async (payload) => {
    return new Promise((resolve) => {
      uniqWorkflow.queue(async () => {
        resolve(await popupStore.limit(payload));
      });
    });
  };
  const vip = async (payload) => {
    return new Promise((resolve) => {
      uniqWorkflow.queue(async () => {
        resolve(await popupStore.vip(payload));
      });
    });
  };
  const gift = async (payload) => {
    return new Promise((resolve) => {
      uniqWorkflow.queue(async () => {
        resolve(await popupStore.gift(payload));
      });
    });
  };
  const giveaway = async (payload) => {
    return new Promise((resolve) => {
      uniqWorkflow.queue(async () => {
        resolve(await popupStore.giveaway(payload));
      });
    });
  };
  const paging = async (payload) => {
    return new Promise((resolve) => {
      uniqWorkflow.queue(async () => {
        resolve(await popupStore.paging(payload));
      });
    });
  };
  const bottomSheet = async (payload) => {
    return new Promise((resolve) => {
      uniqWorkflow.queue(async () => {
        resolve(await popupStore.bottomSheet(payload));
      });
    });
  };
  const surprise = async (payload) => {
    return new Promise((resolve) => {
      uniqWorkflow.queue(async () => {
        resolve(await popupStore.surprise(payload));
      });
    });
  };

  return {
    loadingStart,
    forceStopLoading,
    toast,
    alert,
    confirm,
    modal,
    rank,
    news,
    limit,
    vip,
    gift,
    giveaway,
    paging,
    bottomSheet,
    surprise,
  };
});
