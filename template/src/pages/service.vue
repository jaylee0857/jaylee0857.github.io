<template>
  <iframe id="iframe" :src="serviceUrl" class="h-full w-full" />
</template>
<script>
import { onMounted } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import { useI18nService } from "@/services/i18n-service";
import { useAlertService } from "@/services/alert-service";

export default {
  layout: "layout-content",
  title: "app.page.service",
  setup() {
    const { t } = useI18nService();
    const alertService = useAlertService();
    const serviceUrl = import.meta.env.VITE_SERVICE_URL;
    function setHeight() {
      /* 取瀏覽器總高 */
      let windowsVH = window.innerHeight;
      /* 取head高度 */
      let height = window
        .getComputedStyle(document.querySelector(".sticky"), null)
        .getPropertyValue("height");
      /* 設定body高度 */
      document.querySelector(".layout-content-main").style.height =
        windowsVH - height.substr(0, height.length - 2) + "px";
      window.addEventListener("resize", function () {
        document.querySelector(".layout-content-main").style.height =
          windowsVH - height.substr(0, height.length - 2) + "px";
      });
    }
    // const setiframeDom = () => {
    //   const iframe = document.querySelector("#iframe");
    //   iframe.onload = () => {
    //     setTimeout(() => {
    //       console.log(iframe.contentWindow.document);
    //     }, 1000);
    //   };
    // };
    onMounted(() => {
      setHeight();
      // setiframeDom();
    });
    // 離開頁面前的攔截
    onBeforeRouteLeave(async (to, from, next) => {
      const { isConfirmed } = await alertService.confirm({
        title: t("app.dialog.gohome.title"),
        text: t("app.dialog.gohome.text"),
      });

      // 不離開就回傳本身
      if (!isConfirmed) next(from);
      else next();
    });

    return {
      serviceUrl,
    };
  },
};
</script>
