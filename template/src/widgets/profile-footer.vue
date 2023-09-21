<template>
  <div
    class="text-28 font-light flex flex-col items-center justify-center space-y-2 py-16 text-center"
    style="color: #a6a9b2"
  >
    <div class="whitespace-pre-wrap">
      {{ t("pages.account.profile.notice.line.1") }}
    </div>
    <div class="w-full flex space-x-2 justify-center">
      <div>{{ t("pages.account.profile.notice.line.2") }}</div>
      <router-link to="/service" class="block text-blue-400">
        {{ t("pages.account.profile.notice.line.2.params.0") }}
      </router-link>
    </div>
  </div>
</template>
<script>
import { useI18nService } from "@/services/i18n-service";

export default {
  name: "ProfileFooter",
  setup() {
    const { t } = useI18nService();

    return {
      t,
    };
  },
};
</script>
