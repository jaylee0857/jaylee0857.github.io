/**
 * 單一流程
 */
import { defineWorkflow } from "@/_app/_define";
import { from, Subject } from "rxjs";
import { mergeMap } from "rxjs/operators";

export const useUniqWorkflow = defineWorkflow("uniq-workflow", () => {
  let isRunning = false;
  let waitingQueues = [];

  const observer = new Subject().pipe(
    mergeMap(({ event = null, type = "queue" }) => {
      const action = new Promise((resolve) => {
        const dealQueue = () => {
          if (waitingQueues.length === 0) {
            isRunning = false;
          } else {
            isRunning = true;
            const [event, done] = waitingQueues.shift();
            event().then(() => {
              done();
              dealQueue();
            });
          }
        };
        if (isRunning) {
          switch (type) {
            case "exit":
              waitingQueues = [];
              isRunning = false;
              resolve();
              break;
            case "spot":
              waitingQueues = [[event, resolve], ...waitingQueues];
              break;
            default:
              waitingQueues = [...waitingQueues, [event, resolve]];
              break;
          }
        } else {
          if (type !== "exit") {
            waitingQueues = [[event, resolve]];
            dealQueue();
          }
        }
      });

      return from(action);
    })
  );
  observer.subscribe();

  /**
   * 將活動進入執行隊伍
   *
   * @param {Promise<void>} fn
   */
  const queue = (fn) => {
    observer.next({ event: fn });
  };

  /**
   * 插播活動
   *
   * @param {Promise<void>} fn
   */
  const spot = (fn) => {
    observer.next({ event: fn, type: "spot" });
  };

  /**
   * 強制中斷執行中活動，並清空隊伍中活動
   */
  const exit = () => {
    observer.next({ type: "exit" });
  };

  /**
   * 延遲
   */
  const delay = (interval) => {
    const event = () =>
      new Promise((resolve) => {
        setTimeout(resolve, interval);
      });
    observer.next({ event });
  };

  return { queue, spot, exit, delay };
});
