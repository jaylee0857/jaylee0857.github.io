import { from, EMPTY, Subject } from "rxjs";
import { mergeMap, exhaustMap, concatMap, timestamp } from "rxjs/operators";

const _toObserver = (eventname, ...observable) => {
  /** 僅僅只是將Observer整合 */
  return (passport) => {
    //! for debug 註冊事件用 事件有onceOf之類的...
    passport.sign(eventname);

    const observer = new Subject().pipe(...observable); // 接收多個observable
    const subscribe = observer.subscribe(); // 訂閱
    /* subject可以多次訂閱並且observer共用 */

    return {
      passport,
      /* excute執行next並將done的內容改為回傳內容 */
      excute() {
        return new Promise((resolve) => {
          observer.next({ done: resolve });
        });
      },
      /** 取消訂閱 */
      unsubscribe() {
        subscribe.unsubscribe();
      },
    };
  };
};

/**
 * 允許同一時間存在多個活動
 * @param {RequestPassport} passport
 * @returns
 */
export const mergeOf = (passport) =>
  _toObserver(
    "mergeOf",
    mergeMap(({ done }) => from(passport.action().then(done)))
  )(passport);

/**
 * 同時間只會有一個活動，未完成時取消前一次活動
 * @param {RequestPassport} passport
 * @returns
 *
 * @TODO
 * 尚未實作 axios abort
 */
// export const switchOf = (passport) =>
//   _toObserver(
//     "exhaustOf",
//     switchMap(() => from(passport.action()))
//   )(passport);

/**
 * 同時間只會有一個活動，未完成時忽略其他活動
 * @param {RequestPassport} passport
 * @returns
 */
export const exhaustOf = (passport) =>
  _toObserver(
    "exhaustOf",
    exhaustMap(({ done }) => from(passport.action().then(done)))
  )(passport);

/**
 * 在 [節流時間] 內不接收任何請求活動
 * 超過節流時間就會重新請求
 * @param {Number} limit 每個活動執行的間隔時間
 * @returns
 */
export const throttleExhaustOf = (limit = 0) => {
  let lastRunTime = 0;

  return (passport) =>
    _toObserver(
      "throttleExhaustOf",
      timestamp(),
      exhaustMap(({ timestamp, value: { done } }) => {
        if (timestamp - lastRunTime > limit) {
          lastRunTime = timestamp;
          return from(passport.action().then(done));
        }
        return EMPTY;
      })
    )(passport);
};

/**
 * 在 [節流時間] 內的請求會拿到最後一次回傳值
 * 超過節流時間就會重新請求
 * @param {Number} limit 每個活動執行的間隔時間
 * @returns
 */
export const throttleOf = (limit = 0) => {
  let lastRunTime = 0;
  let cacheResult;

  return (passport) =>
    _toObserver(
      "throttleOf",
      timestamp(),
      concatMap(({ timestamp, value: { done } }) => {
        if (timestamp - lastRunTime > limit) {
          lastRunTime = timestamp;
          return from(
            passport.action().then((resposne) => {
              cacheResult = resposne;
              done(cacheResult);
            })
          );
        }

        done(cacheResult);
        return EMPTY;
      })
    )(passport);
};

/**
 * 接收所有活動並計入佇列，每隔一段時間按照先進先出執行
 * @param {Number} limit 每個活動執行的間隔時間
 * @returns
 */
export const queueOf = (limit = 0) => {
  let lastRunTime = 0;

  return (passport) =>
    _toObserver(
      "queueOf",
      timestamp(),
      concatMap(({ timestamp, value: { done } }) => {
        if (timestamp - lastRunTime > limit) {
          lastRunTime = timestamp;
          return from(passport.action().then(done));
        }

        return from(
          new Promise((resolve) => {
            setTimeout(() => {
              lastRunTime += limit;
              passport.action().then(resolve);
            }, limit - (timestamp - lastRunTime));
          }).then(done)
        );
      })
    )(passport);
};

/**
 * 只會執行一次
 * @returns
 */
export const onceOf = (passport) => {
  let cacheResult;
  return _toObserver(
    "onceOf",
    concatMap(({ done }) => {
      /** 若有cache則表示已經有觸發過 則回傳Empty並且done直接使用舊有資料 */
      if (cacheResult) {
        done(cacheResult);
        return EMPTY;
      }
      /** 若無cache則使用from回傳response執行後的結果 */
      return from(
        passport.action().then((resposne) => {
          cacheResult = resposne;
          done(cacheResult);
        })
      );
    })
  )(passport);
};

/**
 * 當回傳結果符合 conditionFn(response) 則只會執行一次
 * 否則會重複執行
 * @param {(response:any) => boolean} conditionFn
 * @returns
 */
export const whileOnceOf = (conditionFn) => {
  let cacheResult;
  return (passport) => {
    return _toObserver(
      "whileOnceOf",
      concatMap(({ done }) => {
        if (cacheResult && conditionFn(cacheResult)) {
          done(cacheResult);
          return EMPTY;
        }

        return from(
          passport.action().then((resposne) => {
            cacheResult = resposne;
            done(cacheResult);
          })
        );
      })
    )(passport);
  };
};
