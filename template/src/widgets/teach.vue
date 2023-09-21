<template>
  <img :src="src" v-image-reload class="img" />
</template>

<script>
import { useI18nService } from "@/services/i18n-service";
import { teachImage } from "@/imageRouter";
export default {
  setup() {
    const { locale } = useI18nService();
    const src = teachImage(locale.value);
    return {
      src,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/recommend.scss";
</style>
