<template>
  <div class="layout-trade">
    <div class="header" :class="header">
      <div class="go__back" @click.prevent="goBack"></div>
      <div class="title">{{ title }}</div>
      <div class="go__back" style="visibility: hidden"></div>
    </div>
    <div class="container__trade" :class="{ noScroll: isNoScroll }">
      <slot />
      <div class="layout-trade__placeholder">&nbsp;</div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useI18nService } from "@/services/i18n-service";

export default {
  setup() {
    const router = useRouter();
    const { t } = useI18nService();
    const route = useRoute();

    const title = computed(() => t(route.meta.title ?? ""));
    const header = computed(() => route.meta.header);
    const isNoScroll = computed(() => route.meta.scroll);
    const goBack = () => {
      if (router.options.history.state.back === "/") {
        router.push("/home");
      } else {
        router.go(-1);
      }
    };

    return {
      // t,
      title,
      header,
      isNoScroll,
      goBack,
    };
  },
};
</script>
