import { useI18nService } from "@/services/i18n-service";
import { useAlertService } from "@/services/alert-service";
import { useChatWorkflow } from "@/workflows/chat-workflow";

/** 客服彈跳彈窗 */
export const serviceGuard = async (to, from, next) => {
  const chatWorkflow = useChatWorkflow();
  const { t: rootMessages } = useI18nService();
  const alertService = useAlertService();

  const { success, payload } = await chatWorkflow.excute();
  if (!success) {
    let htmlContent = "";
    const { zaloUrl = null, lineUrl = null } = payload;
    if (lineUrl) {
      htmlContent += `<a class="service-list-icon line" target="_blank" href="${lineUrl}"></a>`;
    }
    if (zaloUrl) {
      htmlContent += `<a class="service-list-icon zalo" target="_blank" href="${zaloUrl}"></a>`;
    }
    if (htmlContent) {
      alertService.alert({
        title: rootMessages("app.page.service"),
        html: `<div class="service-list">${htmlContent}</div>`,
        confirmButtonText: rootMessages("pages.home.welcome.close"),
      });
    }
  }

  next({ name: from.path });
};
