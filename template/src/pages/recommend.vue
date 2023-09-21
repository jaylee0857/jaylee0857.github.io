<template>
  <ul class="tag">
    <li
      v-for="(item, index) in tags"
      :key="item"
      :class="{
        isActive: item.isActive,
        'text-center': locale === 'en' || locale === 'vi',
        'notify-tip red': tip && index === 1,
      }"
      @click="toSlide(index)"
    >
      {{ item.text }}
      <div class="line"></div>
    </li>
  </ul>
  <Swiper id="swiper" @slideChange="onChanged">
    <!-- slideChange在切換slide時會觸發 用於切換header的tag-->
    <Swiper-slide class="teach__slide">
      <Recommend></Recommend>
    </Swiper-slide>
    <Swiper-slide class="teach__slide">
      <Commission></Commission>
    </Swiper-slide>
    <Swiper-slide class="teach__slide">
      <Teach></Teach>
    </Swiper-slide>
  </Swiper>
</template>
<script>
import { onMounted, ref, computed } from "vue";
import { useI18nService } from "@/services/i18n-service";
import { useStore } from "vuex";
import { useNotifyStore } from "@/store/notify-store";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import Teach from "@/widgets/teach";
import Commission from "@/widgets/commission";
import Recommend from "@/widgets/recommend";

export default {
  layout: "layout-trade",
  title: "pages.promote.title",
  noScroll: true,
  components: {
    Swiper,
    SwiperSlide,
    Teach,
    Commission,
    Recommend,
  },
  setup() {
    const { t, locale } = useI18nService();
    const store = useStore();
    const notifyStore = useNotifyStore();
    const tags = ref([
      {
        text: t("pages.promote.tab.invite"),
      },
      {
        text: t("pages.promote.tab.commission"),
      },
      {
        text: t("pages.promote.tab.teach"),
      },
    ]);
    const tip = computed(() => notifyStore.isTip("promotion_mia"));

    const onChanged = (e) => {
      //隨著slide更改切換tag
      tags.value = tags.value.map((data, index) => {
        return {
          ...data,
          isActive: index === e.activeIndex,
        };
      });

      // 如果index為1，則調用readNotify
      if (e.activeIndex === 1)
        notifyStore.readNotify({ type: "promotion_mia" });
    };

    const toSlide = (index) => {
      const swiper = document.querySelector("#swiper").swiper;
      swiper.slideTo(index);
    };
    tags.value[0].isActive = true; //預設被選擇的slide

    onMounted(async () => {
      if (store.state.app.recommendIndex !== "") {
        //判斷是否從本頁切換 是的話則回到原先的slide
        toSlide(store.state.app.recommendIndex);
        store.dispatch("app/read/recommendIndex", ""); //rest
      }
    });
    return {
      t,
      onChanged,
      toSlide,
      tip,
      tags,
      locale,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/scss/recommend.scss";
.notify-tip {
  &::before {
    top: 0.1rem;
  }
}
</style>
