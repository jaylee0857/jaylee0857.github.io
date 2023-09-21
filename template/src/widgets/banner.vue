<template>
  <Swiper
    class="banner-swiper"
    :slides-per-view="1"
    :space-between="0"
    :modules="modules"
    @swiper="onSwiper"
    :speed="durationMS"
    loop
    pagination
    autoplay
  >
    <SwiperSlide v-for="(item, idx) in items" :key="`slide-${idx}`">
      <slot :name="item.template ?? 'default'" :data="item"></slot>
    </SwiperSlide>
  </Swiper>
</template>

<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import gsap from "gsap";
import { delay } from "@/tool";

const props = defineProps({
  items: Array,
});

const modules = [Autoplay, Pagination];

const durationMS = 300;

const onSwiper = (swiper) => {
  const wrapperTo = gsap.quickTo(swiper.wrapperEl, "x", {
    duration: durationMS / 1000,
    ease: "none",
    force3D: false,
  });
  const duplicateTo = gsap.quickTo(
    swiper.slides[swiper.slides.length - 1],
    "x",
    {
      duration: durationMS / 1000,
      ease: "none",
      force3D: false,
      yoyo: false,
    }
  );

  swiper.on("setTranslate", (swiper, posX) => {
    wrapperTo(posX);
  });

  swiper.on("slideNextTransitionStart", () => {
    const activeIndex = swiper.activeIndex;
    const totalSlides = swiper.slides.length;

    let posX = 0;
    if (activeIndex !== totalSlides - 1) {
      posX = -totalSlides * swiper.width;
    }
    duplicateTo(posX, posX);
  });

  swiper.on("slideNextTransitionEnd", () => {
    const activeIndex = swiper.activeIndex;
    const totalSlides = swiper.slides.length;

    if (activeIndex === totalSlides - 1) {
      setTimeout(() => {
        wrapperTo(-swiper.size, -swiper.size);
      }, 100);
    }
  });

  swiper.on("slidePrevTransitionStart", () => {
    const activeIndex = swiper.activeIndex;
    const totalSlides = swiper.slides.length;

    let posX = 0;
    if (activeIndex !== 0) {
      posX = -totalSlides * swiper.width;
    }
    duplicateTo(posX, posX);
  });

  swiper.on("slidePrevTransitionEnd", () => {
    const activeIndex = swiper.activeIndex;

    if (activeIndex === 0) {
      setTimeout(() => {
        const to = props.items.length * swiper.size;
        wrapperTo(-to, -to);
      }, 100);
    }
  });

  swiper.on("touchStart", () => {
    swiper.autoplay.stop();
  });

  swiper.on("touchEnd", async () => {
    /** 啟用自動播放
     * setTranslate 會將 autoplay 關閉
     * 等 setTranslate 後，重新觸發autoplay */
    await delay(1000);
    swiper.autoplay.start();
  });
};
</script>

<style>
.banner-swiper {
  height: 3.75rem;
}

.swiper-pagination {
  line-height: 0;
}

.swiper-horizontal > .swiper-pagination-bullets,
.swiper-pagination-bullets.swiper-pagination-horizontal {
  bottom: 6px;
}

.swiper-pagination-bullet {
  width: 10px;
  height: 4px;
  background: #eee;
  border-radius: 9999px;
  transform-origin: center;
  opacity: 0.8;
  transition: width cubic-bezier(0.175, 0.885, 0.32, 1.275) 300ms;
  /* display: none; */
}

.swiper-pagination-bullet-active {
  width: 16px;
  background: #fff;
  opacity: 1;
}

.swiper-horizontal > .swiper-pagination-bullets .swiper-pagination-bullet,
.swiper-pagination-horizontal.swiper-pagination-bullets
  .swiper-pagination-bullet {
  margin: 0 2px;
}
.swiper-wrapper,
.swiper-slide {
  will-change: transform;
}
</style>
