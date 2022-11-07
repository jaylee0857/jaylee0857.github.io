<template>
  <component :is="layout" :key="locale">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </component>
</template>

<script>
import { computed, watch } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "@/hooks/use-i18n";
import { isNil, defaultTo, path } from "ramda";

export default {
  setup() {
    const route = useRoute();
    const i18n = useI18n();
    const layout = computed(() => {
      /* 一開始都是 undefined */
      if (isNil(route.path)) return null;
      /* 拿設定的 layout */
      return defaultTo(null)(path(["meta", "layout"], route));
    });

    watch(
      i18n.locale,
      (locale) => {
        document.documentElement.lang = locale;
        document.title = i18n.t("app.name");
      },
      { immediate: true }
    );

    return {
      layout,
      locale: i18n.locale,
    };
  },
};
</script>
