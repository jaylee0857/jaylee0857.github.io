import { createRouter, createWebHashHistory } from "vue-router";
import createRoutes from "@/_app/routes";

const options = {
  defaultPath: "/home",
};

const router = createRouter({
  history: createWebHashHistory(
    import.meta.env.BASE_URL /* read from vite.config.js */
  ),
  routes: createRoutes(options),
});

export default router;
