import { defineService } from "@/_app/_define";
import { useI18nService } from "@/services/i18n-service";
import { useAlertProvider } from "@/providers/alert-provider";

export const useAlertService = defineService("alert-service", () => {
  const provider = useAlertProvider();
  const i18n = useI18nService();

  return {
    toast(title) {
      return provider.fire({
        title,
        toast: true,
        showConfirmButton: false,
        customClass: "swal2-toast",
        showClass: {
          popup: "animate__animated animate__fadeInUp",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutDown",
        },
        timer: 2000,
        background: "transparent",
        didOpen: (toast) => {
          toast.addEventListener("click", this.close);
        },
      });
    },

    alert({
      title,
      text,
      willClose = null,
      heightAuto = false,
      html = false,
      confirmButtonText,
      style = "",
    }) {
      return provider.fire({
        title,
        text,
        html,
        customClass: `swal2-alert ${style}`,
        heightAuto,
        showClass: {
          popup: "animate__animated animate__fadeInUp",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutDown",
        },
        willClose,
        confirmButtonText: confirmButtonText ?? i18n.t("button.confirm"),
        showCloseButton: true,
      });
    },

    showLoading() {
      return provider.fire({
        title: "winner winner chicken dinner",
        showConfirmButton: false,
        customClass: "swal2-loading",
        showClass: {
          popup: "animate__animated animate__fadeIn",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOut",
        },
        background: "transparent",
      });
    },

    confirm({
      title, //標題
      text, //內文
      html,
      confirmButtonText,
      cancelButtonText,
      confirmCallback = null, //確認後callback
      heightAuto = false, //是否啟用heightAuto
      customClass = "",
    }) {
      return provider.fire({
        title,
        text,
        html,
        customClass: `swal2-confirm ${customClass}`,
        confirmButtonText: confirmButtonText ?? i18n.t("button.confirm"),
        cancelButtonText: cancelButtonText ?? i18n.t("button.cancel"),
        heightAuto,
        showCancelButton: true,
        showCloseButton: false,
        showClass: {
          popup: "animate__animated animate__fadeInUp",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutDown",
        },
        /* 在使用mixin後didOpen這些功能都沒辦法使用 */
        preConfirm() {
          confirmCallback?.();
        },
      });
    },

    close() {
      provider.close();
    },
  };
});
