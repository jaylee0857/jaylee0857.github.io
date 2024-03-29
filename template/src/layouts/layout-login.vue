<template>
  <div
    class="layout-login flex flex-col justify-between h-screen"
    v-bg-image-load:image="{
      old: getImageUrl('login/login_background_sm2.png'),
      cover: getImageUrl('login/login_background2.png'),
    }"
  >
    <div
      class="flex flex-shrink-0 flex-grow-0 justify-between items-center p-6"
    >
      <a href="#" @click.prevent="goBack">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          fill="currentColor"
          class="bi bi-arrow-left w-12 h-12 text-white"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
          />
        </svg>
      </a>
      <div
        class="text-white flex items-center cursor-pointer"
        @click="openLocaleSwitcher"
      >
        <span class="text-28 mr-3">
          {{ t(`pages.account.link.languages.desc`) }}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          fill="currentColor"
          class="bi bi-globe w-12 h-12"
          viewBox="0 0 16 16"
        >
          <path
            d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z"
          />
        </svg>
      </div>
    </div>
    <div class="flex-1 overflow-x-hidden overflow-y-auto h-full">
      <slot />
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { useI18nService } from "@/services/i18n-service";
import { usePopupWorkflow } from "@/workflows/common/popup-workflow";

/** components */
import BottomPicker from "@/widgets/popup/bottom-sheet/bottom-picker";
import { getImageUrl } from "@/tool";
import oldBg from "@/assets/images/login/login_background_sm.png";

export default {
  setup() {
    const router = useRouter();
    const { t, locale, setLocale } = useI18nService();
    const popupWorkflow = usePopupWorkflow();
    const goBack = () => {
      router.push("/home");
    };
    /** 語系選擇器 */
    const openLocaleSwitcher = async () => {
      const { isConfirmed, result } = await popupWorkflow.bottomSheet({
        component: BottomPicker,
        props: {
          options: [
            [
              { value: "tw", label: "繁中" },
              { value: "en", label: "English" },
              { value: "vn", label: "Việt Nam" },
              { value: "ph", label: "Pilipino" },
            ],
          ],
          value: [locale.value],
        },
      });

      if (isConfirmed && locale.value !== result.value[0]) {
        /**
         * 啟用 loading 做流程卡位
         * 在下方 timeout 一個等待時間
         * 讓其他語系監聽的行為可以處理
         * 處理完再彈 toast
         */
        const loadingStop = popupWorkflow.loadingStart();
        setLocale(result.value[0]);
        popupWorkflow.toast(t("feedback.save.success"));
        loadingStop(300);
      }
    };
    return {
      oldBg,
      locale,
      t,
      goBack,
      getImageUrl,
      openLocaleSwitcher,
    };
  },
};
</script>
