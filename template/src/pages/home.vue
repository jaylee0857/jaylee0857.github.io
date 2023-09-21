<template>
  <div
    class="home"
    v-bg-image-load:image="{
      old: getImageUrl('home/home_background_middle2.png'),
      cover: getImageUrl('home/home_background2.png'),
      center: false,
      originSize: true,
      isFixed: true,
      isBg: true,
      custom:
        'width: 100%;height: 4rem;background: no-repeat center -0.46rem / cover;',
      beforeCss: 'background-size: contain;',
    }"
  >
    <div class="home__header" :class="[env]" ref="head">
      <router-link
        :to="{ path: '/news', state: { from: '消息中心' } }"
        class="home__message"
        >&nbsp;</router-link
      >
    </div>
    <!-- 輪播圖 -->
    <div class="home__banner">
      <div class="home__banner__inner">
        <Banner />
      </div>
    </div>
    <!-- 跑馬燈 -->
    <div class="home__marquee">
      <div class="home__marquee__inner">
        <Marquee />
      </div>
    </div>
    <User />
    <!-- 遊戲選單 -->
    <div class="home__game" @touchmove.stop>
      <Game />
    </div>
  </div>
  <!-- 若小遊戲遊玩次數為0則隱藏 目前為測試用所以都先固定顯示 -->
  <Buoy :num="playQuantity" />
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useStore } from "vuex";
import { useGameStore } from "@/store/game-store";

/** workflows */
import { useHomeWorkflow } from "@/workflows/pages/home-workflow";

/** components */
import Banner from "@/widgets/pages/home/banner";
import Marquee from "@/widgets/pages/home/marquee";
import Game from "@/widgets/pages/home/game";
import Buoy from "@/widgets/pages/home/buoy";
// import Download from "@/widgets/download";
import User from "@/widgets/pages/home/user.vue";

/** helper */
import { getImageUrl } from "@/tool";

const homeWorkflow = useHomeWorkflow();
const store = useStore(); //取得store
const gameStore = useGameStore();

const playQuantity = computed(() => gameStore.redPacket?.receive_left ?? 0);
const env = computed(() => store.state.app.env);

homeWorkflow.created();

onMounted(() => {
  window.addEventListener("pageshow", () => {
    /** 沒救了，強制刷新吧 */
    window.location.reload();
  });
});
</script>

<style lang="scss">
@import "@/assets/scss/home.scss";
</style>
