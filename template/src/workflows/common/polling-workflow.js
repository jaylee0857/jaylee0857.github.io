import { timer, from, Subject } from "rxjs";
import { switchMap, takeUntil } from "rxjs/operators";
import { defineWorkflow } from "@/_app/_define";

export const usePollingWorkflow = defineWorkflow("polling-workflow", () => {
  let pollingRunners = [];

  /**
   * 輪詢封裝
   * @param {() => Promise} request
   * @param {Number} period 間隔時間
   * @returns {Function} pollingStop
   *
   * @use
   * 建立一個間隔 30 秒的輪詢
   * const pollingStop = pollingStart(store.action, 30000);
   *
   * 停止時呼叫
   * pollingStop();
   */
  const pollingStart = (request, period) => {
    /** 建立一個媒介 */
    const subject = new Subject();
    subject.subscribe();

    /** 主事件，產生一個訂閱 */
    const pollObserver = timer(0, period).pipe(
      /**
       * 取消前一次的訂閱
       * 上一個輪詢沒有完成，會棄用重新建立新訂閱
       */
      switchMap(() => from(request())),
      /** 直到 subject 送出訊號才停止 */
      takeUntil(subject)
    );

    /** GO */
    pollObserver.subscribe();

    /** 建立一個停止事件做返回 */
    const pollingStop = () => {
      /** 送出訊號以停止訂閱 */
      subject.next();
    };

    pollingRunners.push(pollingStop);

    return pollingStop;
  };

  /**
   * 停止所有輪詢
   */
  const allPollingStop = () => {
    for (let runner of pollingRunners) {
      runner();
    }
    pollingRunners = [];
  };

  return {
    pollingStart,
    allPollingStop,
  };
});
