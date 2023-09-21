<template>
  <div class="my-3 bg-white flex items-start">
    <div
      class="w-10 sticky top-24 flex justify-center items-center flex-grow-0 flex-shrink-0 mt-20"
      :class="{ invisible: activeTabIdx === 0 }"
      style="height: 4.5rem"
    >
      <svg
        @click="toPrev"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        class="bi bi-chevron-left w-10 h-10"
        viewBox="0 0 16 16"
      >
        <path
          fill-rule="evenodd"
          d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
        />
      </svg>
    </div>
    <div class="flex-1 w-full overflow-hidden">
      <Swiper
        :slides-per-view="1"
        :space-between="10"
        @swiper="onSwiper"
        @slideChange="onSlideChange"
      >
        <SwiperSlide v-for="i in 4" :key="i">
          <div class="py-6">
            <div class="text-36 text-center font-bold h-10">
              {{ t(`pages.account.link.member.title.${i - 1}`) }}
            </div>
            <div class="mt-6">
              <div class="title__image">
                <img class="title__image__cover" :src="covers[i - 1]" />
                <img
                  class="title__image__avatar"
                  src="@/assets/images/account/vip/sample_head.jpg"
                />
              </div>
            </div>
            <div class="mt-3">
              <img class="rounded-md" :src="rules[i - 1]" />
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
    <div
      class="w-10 sticky top-24 flex justify-center items-center flex-grow-0 flex-shrink-0 mt-20"
      :class="{ invisible: activeTabIdx === 3 }"
      style="height: 4.5rem"
    >
      <svg
        @click="toNext"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        class="bi bi-chevron-right w-10 h-10"
        viewBox="0 0 16 16"
      >
        <path
          fill-rule="evenodd"
          d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
        />
      </svg>
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
import { useI18nService } from "@/services/i18n-service";
import { Swiper, SwiperSlide } from "swiper/vue";
import { titleCoverImage, titleRuleImage } from "@/imageRouter";

export default {
  layout: "layout-content",
  title: "pages.account.link.member.title",
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    const { t, locale } = useI18nService();
    const activeTabIdx = ref(0);
    const swiperController = ref();

    const onSwiper = (swiper) => {
      swiperController.value = swiper;
    };
    const onSlideChange = (swiper) => {
      activeTabIdx.value = swiper.activeIndex;
    };
    const toPrev = () => {
      swiperController.value.slidePrev();
    };
    const toNext = () => {
      swiperController.value.slideNext();
    };

    const covers = titleCoverImage();

    const rules = titleRuleImage(locale.value);
    // 這邊的做法是直接從{}取對應的key的value example: rules = { x:1 }["x"]
    // 這邊可以依照這個思路，分成demo與非demo
    // alert(locale.value);
    return {
      t,
      activeTabIdx,
      covers,
      rules,
      onSwiper,
      onSlideChange,
      toPrev,
      toNext,
    };
  },
};
</script>
<style lang="scss" scoped>
.title__image {
  position: relative;
  height: 4.5rem;
  width: 100%;

  &__cover {
    position: relative;
    z-index: 2;
  }
  &__avatar {
    position: absolute;
    z-index: 1;
    top: 0.9rem;
    left: 0.1rem;
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 1.6rem;
  }
}
</style>
