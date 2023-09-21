<template>
  <div class="bg-white mt-5 pb-5">
    <router-link
      v-for="i in 2"
      :key="`helper-link-${i}`"
      :to="`/account/helper/${i - 1}`"
      class="px-8 flex items-center focus:bg-gray-200"
    >
      <div class="flex mr-6 justify-center items-center">
        <img
          class="h-8 w-8"
          src="@/assets/images/account/icon_info_dialog.webp"
        />
      </div>
      <div class="py-6 border-b w-full color-base text-28 whitespace-nowrap">
        {{ t(`pages.helper.support.${i - 1}.title`) }}
      </div>
    </router-link>
  </div>
</template>
<script>
import { useI18nService } from "@/services/i18n-service";

export default {
  layout: "layout-content",
  title: "pages.account.link.helper.center",
  setup() {
    const { t } = useI18nService();

    return {
      t,
    };
  },
};
</script>
