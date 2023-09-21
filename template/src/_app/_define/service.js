import { startsWith, memoizeWith, identity, is } from "ramda";

export const defineService = (id, instance) => {
  const useService = memoizeWith(identity, () => {
    if (typeof instance === "function") {
      instance = instance();
    }

    const CONSTANT_SIGNAL = "$";

    const messages = {
      isNotExist: (propKey) =>
        `[Service (${id})] ReferenceError: propKey '${propKey}' is not defined.`,
      isConstant: (propKey) =>
        `[Service (${id})] SyntaxError: propKey '${propKey}' is not writeable.`,
    };

    const exceptionZone = (target, propKey) => {
      const fn = target[propKey];
      if (fn.constructor.name === "AsyncFunction") {
        return async (...args) => {
          try {
            return await fn.call(target, ...args);
          } catch (e) {
            throw `[Service (${id})] ${e}`;
          }
        };
      }

      return (...args) => {
        try {
          return fn.call(target, ...args);
        } catch (e) {
          throw `[Service (${id})] ${e}`;
        }
      };
    };

    const proxy = new Proxy(instance, {
      set(target, propKey, value, receiver) {
        switch (true) {
          case !Reflect.has(target, propKey):
            throw messages.isNotExist(propKey);
          case startsWith(CONSTANT_SIGNAL, propKey):
            throw messages.isConstant(propKey);
        }
        return Reflect.set(target, propKey, value, receiver);
      },

      get(target, propKey, receiver) {
        switch (true) {
          case !Reflect.has(target, propKey):
            throw messages.isNotExist(propKey);
          case is(Function, target[propKey]):
            return exceptionZone(target, propKey);
        }
        return Reflect.get(target, propKey, receiver);
      },

      deleteProperty(target, propKey) {
        switch (true) {
          case !Reflect.has(target, propKey):
            throw messages.isNotExist(propKey);
          case startsWith(CONSTANT_SIGNAL, propKey):
            throw messages.isConstant(propKey);
        }
        Reflect.deleteProperty(target, propKey);
        return true;
      },
    });

    return proxy;
  });

  return useService;
};
