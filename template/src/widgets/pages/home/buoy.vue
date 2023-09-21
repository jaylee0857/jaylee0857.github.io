<template>
  <div
    class="game__link"
    v-bg-image-load:image="{
      old: getImageUrl('home/icon_redEnvelope_pop_middle.png'),
      cover: getImageUrl('home/icon_redEnvelope_pop.png'),
      center: false,
      originSize: true,
      isFixed: true,
      isBg: true,
      custom:
        'display: flex;justify-content: flex-end;width: 2rem;height: 2.5rem;background-size: cover;z-index: 0;animation: baloon_1 3s infinite;animation-delay: 2.5s;',
    }"
  >
    <div class="buoy__icon"></div>
    <div class="buoy__title"></div>
    <div class="buoy__num">{{ num }}</div>
  </div>
</template>

<script>
import { onMounted } from "vue";
import { useGameWorkflow } from "@/workflows/game-workflow";
import { getImageUrl } from "@/tool";

export default {
  props: ["num"],
  setup() {
    const gameWorkflow = useGameWorkflow();

    onMounted(() => {
      setTimeout(() => {
        //利用setTimeout的原因是要先讓首頁的dom寬度先出來再賦予事件，以避免bouy跑出範圍。
        let dragDiv = document.querySelector(".game__link"); //移動物體本身
        let dropArea = document.querySelector(".home"); //移動範圍div
        let area = {
          //移動範圍設定
          left: dropArea.offsetLeft,
          right:
            dropArea.offsetLeft + dropArea.offsetWidth - dragDiv.offsetWidth,
          top: dropArea.offsetTop,
          bottom:
            dropArea.offsetTop + dropArea.offsetHeight - dragDiv.offsetHeight,
        };
        let startX = 0;
        let startY = 0;

        let startTime = 0; //透過計算移動的時常來決定是拖曳還是click事件 因為會是mouse event會先執行 所以會在mouse階段判斷是否執行click
        let endTime = 0;
        window.clickFalg = true; //透過全域變數來避免mouseup及click的衝突 true為可執行

        dragDiv.addEventListener("click", toPlay);
        dragDiv.addEventListener("mousedown", dragStart); //滑鼠事件
        dragDiv.addEventListener("touchstart", dragStart); //移動端事件
        function dragStart(e) {
          startTime = new Date().getTime();
          window.clickFalg = false;
          //記錄點擊相對被點擊物件的座標
          if (e.changedTouches) {
            //手機端
            startX = e.changedTouches[0].clientX - dragDiv.offsetLeft;
            startY = e.changedTouches[0].clientY - dragDiv.offsetTop;
          } else {
            startX = e.clientX - dragDiv.offsetLeft;
            startY = e.clientY - dragDiv.offsetTop;
          }
          // 滑鼠事件
          document.addEventListener("mousemove", move);
          document.addEventListener("mouseup", stop);
          // 移動端事件
          document.addEventListener("touchmove", move, { passive: false });
          document.addEventListener("touchend", stop);
        }

        function move(e) {
          //計算出拖曳物件最左上角座標
          e.preventDefault();
          let x, y;
          if (e.changedTouches) {
            x = e.changedTouches[0].clientX - startX;
            y = e.changedTouches[0].clientY - startY;
          } else {
            x = e.clientX - startX;
            y = e.clientY - startY;
          }

          x = Math.max(Math.min(x, area.right), area.left);
          y = Math.max(Math.min(y, area.bottom), area.top);
          dragDiv.style.left = x + "px";
          dragDiv.style.top = y + "px";
        }

        function stop() {
          // 滑鼠事件
          document.removeEventListener("mousemove", move);
          document.removeEventListener("mouseup", stop);
          // 移動端事件
          document.removeEventListener("touchmove", move);
          document.removeEventListener("touchend", stop);
          endTime = new Date().getTime();
          if (endTime - startTime < 200) window.clickFalg = true; //若移動時間小於200ms則為click事件
        }

        function checkMobile() {
          const mobiles = [
            "Android",
            "webOS",
            "iphone",
            "iPad",
            "iPod",
            "BlackBerry",
            "windows Phone",
          ];
          let isMobile = mobiles.some((e) => {
            return navigator.userAgent.indexOf(e) !== -1;
          });
          return isMobile;
        } //用於偵測是否為行動裝置

        async function toPlay() {
          if (!window.clickFalg && !checkMobile()) return; //若非手機且旗標為false則return 主要用於判斷是click事件還是拖曳事件
          return gameWorkflow.playAddition();
        }
      }, 1000);
    });
    return {
      getImageUrl,
    };
  },
};
</script>

<style lang="sass" scoped>
@import "@/assets/scss/buoy.scss"
</style>
