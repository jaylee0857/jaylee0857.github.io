<template>
  <div class="layout-content">
    <div class="header sticky top-0 left-0 w-full h-24 z-30">
      <the-header go-back-button>
        <template v-slot:title>{{ title }}</template>
      </the-header>
    </div>
    <div class="layout-content-main">
      <slot />
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useI18nService } from "@/services/i18n-service";

export default {
  setup() {
    const { t } = useI18nService();
    const route = useRoute();
    const title = computed(() => t(route.meta.title ?? ""));
    return {
      title,
    };
  },
};
</script>
