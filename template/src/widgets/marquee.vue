<template>
  <Swiper
    :rewind="true"
    :slides-per-view="1"
    :space-between="0"
    :modules="modules"
    direction="vertical"
    @swiper="onSwiper"
    @slideChange="onChanged"
    :autoplay="{
      delay: options.duration,
    }"
    auto-height
  >
    <SwiperSlide v-if="texts.length === 0">
      {{ t("pages.home.marquee.empty") }}
    </SwiperSlide>
    <SwiperSlide v-else v-for="(text, idx) in texts" :key="idx">
      {{ text }}
    </SwiperSlide>
  </Swiper>
</template>
<script setup>
import { ref, inject, onUnmounted } from "vue";
import { useI18nService } from "@/services/i18n-service";
import { Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/virtual";

defineProps({
  texts: Array,
});

const $swiper = ref();
const $ = inject("$jQuery");
const { t } = useI18nService();
let timer = null;
const options = {
  duration: 3000 /* 動畫停留時間(ms) 無設置則不播放*/,
  horizontalStay: 2000 /** 橫向動畫結束後的停留時間(ms) */,
  space: 5 /** 每幀移動距離 */,
};
const modules = [Autoplay];
/* 設定swiper ref 搭配@swiper */
const onSwiper = (swiper) => {
  $swiper.value = swiper;
};
const onChanged = () => {
  /* 抓取dom資訊 */
  const current = $($swiper.value.$wrapperEl)
    .children()
    .get($swiper.value.activeIndex);
  const currentWidth = $(current).width(); // 當前slide-dom寬度
  const parentWidth = $($swiper.value.$wrapperEl).width(); //swiper外層寬度
  /* 當當前寬度大於外層寬度執行動畫 */
  if (currentWidth > parentWidth) {
    $swiper.value.autoplay.stop(); //關閉autoplay

    const unitSpace = (parentWidth - currentWidth) / options.space; //計算時長 父層寬 - 當前寬 / 每幀移動距離
    const moveDuration = Math.abs(unitSpace * 60); /* 60: 每幀 */
    $(current).css({
      transition: `transform ${moveDuration}ms linear 1s`, // moveDuration為動畫時間 1s為延遲時間
      transform: `translate3d(${parentWidth - currentWidth}px, 0, 0)`,
    });
    /* 位置歸位 */
    timer = setTimeout(function () {
      $swiper.value.autoplay.start(); //開啟autoplay
      timer = setTimeout(function () {
        $(current).css({
          transition: "",
          transform: "translate3d(0, 0, 0)",
        });
      }, options.duration);
    }, moveDuration + options.horizontalStay);
  }
};

onUnmounted(() => {
  clearTimeout(timer);
});
</script>
<style>
.swiper-slide {
  width: auto;
  white-space: nowrap;
}
</style>
