import pages from "./pages";
import { mergeDeepRight, findIndex } from "ramda";

export const createRoutes = (opts) => {
  /* 預設導入頁 */
  const options = mergeDeepRight(
    {
      defaultPath: "/",
    },
    opts
  );

  const routes = [
    {
      path: "/",
      name: "default-path",
      redirect: { name: options.defaultPath },
    },
    ...pages, // 通過在pages資料夾建立.vue檔就會自動新增
    {
      path: "/404",
      name: "not-found",
      meta: { layout: "layout-error" },
      component: { template: null },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-match",
      redirect: { name: "not-found" },
    },
  ];

  return routes;
};

export const useSubscribe = (routes) => {
  const withContext = () => {
    let ctx = {};
    return (fn) => (to, from, next) => fn(to, from, next, ctx);
  };

  const beforeEnter = (name, fns, { overwrite = false } = {}) => {
    const guards = fns.map(withContext());

    if (name === "*") {
      routes.forEach((route) => {
        switch (route.name) {
          case "not-match":
          case "not-found":
            return;
        }
        route.beforeEnter = guards;
      });
    } else {
      const targetIdx = findIndex((route) => route.name === name, routes);
      if (targetIdx > -1) {
        if (overwrite) {
          routes[targetIdx].beforeEnter = guards;
        } else {
          routes[targetIdx].beforeEnter = [
            ...routes[targetIdx].beforeEnter,
            ...guards,
          ];
        }
      }
    }
  };

  return { beforeEnter };
};
