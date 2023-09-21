/* eslint-disable no-unused-vars */
export class RequestPassport {
  constructor(id, action) {
    this.id = id;
    this._action = action;
    this._gangway = [];
    this._event = {};
  }

  pipe(...operators) {
    const standIn = new RequestPassport(this.id, this._action);
    for (let operator of operators) {
      const action = operator.creator(standIn);
      standIn.nesting(operator.id, action);
    }
    return standIn;
  }

  nesting(name, fn) {
    const $this = this;
    const action = this._action;
    this._action = () =>
      new Promise((resolve) => {
        $this.sign(name);
        fn(action)
          .then(resolve)
          .catch((error) => {
            $this.throwError(error);
          });
      });
  }

  on(eventName, fn) {
    this._event = {
      ...this._event,
      [eventName]: fn,
    };
  }

  call(eventName, ...args) {
    if (!(eventName in this._event)) {
      console.warn(`[Workflow] event name: '${eventName}' is not attach.`);
      return;
    }
    this._event[eventName](...args);
  }

  action() {
    return this._action();
  }

  sign(eventName) {
    this._gangway = [eventName, ...this.gangway];
  }

  get gangway() {
    return this._gangway;
  }

  throwError(error) {
    console.error("[WorkFlow]", {
      id: this.id,
      error,
      gangway: this._gangway,
    });
    // eslint-disable-next-line no-debugger
    debugger;
  }
}

/**
 *
 * @param {String} id 護照主鍵用來錯誤追蹤，盡量是唯一值
 * @param {Promise<any>} action api 請求事件
 */
export const createPassport = (id, action) => {
  const passport = new RequestPassport(`passport.${id}`, action);
  return passport;
};
