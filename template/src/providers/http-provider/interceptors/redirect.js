import router from "@/router";
import { useAuthStore } from "@/store/auth-store";
import { useI18nService } from "@/services/i18n-service";
import { useAlertService } from "@/services/alert-service";

const redirect = {
  install: (register) => {
    register.response.use(async function (response) {
      const authStore = useAuthStore();
      const { noredirect = false } = response.config ?? {};
      if (!noredirect) {
        const { t } = useI18nService();
        const alertService = useAlertService();
        const data = response.data;
        switch (data.code) {
          case 0:
          case 100002:
          case 200001:
          case 200002:
          case 200003:
          case 200004:
          case 200005: {
            const { isConfirmed } = await alertService.alert({
              title: `Error(${data.code})`,
              text: t(`error.code.${data.code}`),
            });
            if (isConfirmed) {
              await authStore.logout();
              await router.replace("/login");
            }
            return Promise.reject(`Error: ${data.code}`);
          }
        }
      }
      return response;
    });
  },
};

export default redirect;
