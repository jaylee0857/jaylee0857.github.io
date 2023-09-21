import { useAuthStore } from "@/store/auth-store";

const auth = {
  install: (register) => {
    register.request.use(function (config) {
      const { noauth = false } = config;

      if (!noauth) {
        const authStore = useAuthStore();
        /** 有值就寫入 */
        const accessToken = authStore.accessToken;
        if (accessToken) {
          /** 寫入 header Authorization */
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      }
      return config;
    });
  },
};

export default auth;
