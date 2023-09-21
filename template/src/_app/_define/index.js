import { memoizeWith, identity } from "ramda";

export { defineService } from "./service";

export { defineWorkflow } from "./workflow";

export const defineProvider = (instance) => {
  /**
   * memoizeWith共有兩個參數，兩個參數都必須要傳入函式，第一個函式要回傳作為緩存的key，第二個則是調用時回傳的函式
   * 所以在下方identity的是一個函式，功能是回傳所傳入的值，例如identity(2)，那就會回傳2。主要是因為memoizeWith的參數要傳入函式，所以才使用。
   * 而memoize的作用是，當調用時會儲存根據第一個函式所回傳的值(這邊稱為緩存的key)，若二次調用的值與緩存的key相同，則直接回傳第二個函式的回傳的結果。
   * 就不會再次調用第二個函式以此來節省效能。
   */
  const useProvider = memoizeWith(identity, () => {
    if (typeof instance === "function") {
      instance = instance();
    }
    return instance;
  });

  return useProvider;
};
