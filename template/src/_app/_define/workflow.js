import { memoizeWith, identity, is } from "ramda";

export const defineWorkflow = (id, workflowFn) => {
  const useWorkflow = memoizeWith(identity, () => {
    if (typeof workflowFn !== "function") {
      throw `[Workflow (${id})] workflow must be a function.`;
    }

    const messages = {
      isNotExist: (propKey) =>
        `[Workflow (${id})] ReferenceError: propKey '${propKey}' is not defined.`,
    };

    const exceptionZone = (target, propKey) => {
      const fn = target[propKey];
      if (fn.constructor.name === "AsyncFunction") {
        return async (...args) => {
          try {
            return await fn.call(target, ...args);
          } catch (e) {
            throw `[Workflow (${id})] ${e}`;
          }
        };
      }

      return (...args) => {
        try {
          return fn.call(target, ...args);
        } catch (e) {
          throw `[Workflow (${id})] ${e}`;
        }
      };
    };

    const proxy = new Proxy(workflowFn(), {
      set(target, propKey, value, receiver) {
        switch (true) {
          case !Reflect.has(target, propKey):
            throw messages.isNotExist(propKey);
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
        }
        Reflect.deleteProperty(target, propKey);
        return true;
      },
    });

    return proxy;
  });

  return useWorkflow;
};
