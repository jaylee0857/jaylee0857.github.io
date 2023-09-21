<template>
  <div class="bg-white mt-5 pb-5">
    <div class="px-8 flex items-center">
      <div
        class="pl-6 py-6 border-b w-full text-28 font-bold"
        style="color: #333333"
      >
        {{ t(`pages.helper.support.${index}.title`) }}
      </div>
    </div>
    <div class="px-8 flex items-center">
      <div
        class="pl-6 py-6 w-full text-26 leading-relaxed"
        style="color: #414655"
      >
        {{ t(`pages.helper.support.${index}.content`) }}
      </div>
    </div>
  </div>
</template>
<script>
import { useRoute } from "vue-router";
import { useI18nService } from "@/services/i18n-service";

export default {
  layout: "layout-content",
  title: "pages.helper.link.support",
  setup() {
    const route = useRoute();
    const { t } = useI18nService();

    return {
      t,
      index: route.params.idx,
    };
  },
};
</script>
