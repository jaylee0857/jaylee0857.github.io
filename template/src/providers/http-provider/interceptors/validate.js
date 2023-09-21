import { useI18nService } from "@/services/i18n-service";
import { useAlertService } from "@/services/alert-service";

const validate = {
  install: (register) => {
    register.response.use(async function (response) {
      const { novalidate = false } = response.config ?? {};
      if (!novalidate) {
        const { t } = useI18nService();
        const alertService = useAlertService();
        const data = response.data;
        switch (data.code) {
          case 100000:
          case 100001:
          case 100003:
            await alertService.alert({
              title: `Error(${data.code})`,
              text: t(`error.code.${data.code}`),
            });
        }
      }
      return response;
    });
  },
};

export default validate;
