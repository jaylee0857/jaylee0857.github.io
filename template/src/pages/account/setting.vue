<template>
  <div class="min-h-screen">
    <router-link
      to="/account/password"
      class="bg-white mt-5 p-8 flex justify-between focus:bg-gray-200"
    >
      <div class="flex justify-center items-center space-x-5">
        <div class="color-base text-28 whitespace-nowrap">
          {{ t("pages.setting.password") }}
        </div>
      </div>
      <div class="flex justify-center items-center space-x-5">
        <img class="h-5" src="@/assets/images/withdraw/icon_arrow_right.webp" />
      </div>
    </router-link>
    <router-link
      to="/service"
      class="bg-white mt-5 p-8 flex justify-between focus:bg-gray-200"
    >
      <div class="flex justify-center items-center space-x-5">
        <div class="color-base text-28 whitespace-nowrap">
          {{ t("pages.setting.feedback") }}
        </div>
      </div>
      <div class="flex justify-center items-center space-x-5">
        <img class="h-5" src="@/assets/images/withdraw/icon_arrow_right.webp" />
      </div>
    </router-link>
    <a
      href="#"
      @click.prevent="onSignOut"
      class="bg-white mt-5 p-8 flex justify-center focus:bg-gray-200"
    >
      <div class="color-base text-28 whitespace-nowrap">
        {{ t("pages.setting.logout") }}
      </div>
    </a>
  </div>
</template>
<script>
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "vue-router";
import { useI18nService } from "@/services/i18n-service";
import { useAlertService } from "@/services/alert-service";

export default {
  layout: "layout-content",
  title: "app.page.setting",
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const { t } = useI18nService();
    const alertService = useAlertService();

    const onSignOut = async () => {
      const { isConfirmed } = await alertService.confirm({
        title: t("app.dialog.logout.title"),
        text: t("app.dialog.logout.text"),
      });

      if (isConfirmed) {
        await authStore.logout();
        router.replace("default-path");
      }
    };

    return {
      t,
      onSignOut,
    };
  },
};
</script>
