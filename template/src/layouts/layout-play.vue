<template>
  <div class="layout-trade" style="height: 100vh">
    <div class="go-back">
      <div class="icon"></div>
    </div>
    <div class="h-full">
      <slot />
    </div>
  </div>
</template>

<script>
import { onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useI18nService } from "@/services/i18n-service";
import { useAlertService } from "@/services/alert-service";
// import axios from "@/axios";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const { t } = useI18nService();
    const alertService = useAlertService();

    onMounted(() => {
      let setDrag = setInterval(() => {
        //使用setInterval的目的是為了要讓ifream也吃到mouseDown的event
        console.log("執行事件賦予");
        if (
          store.state.app.gameUrl !== "" ||
          !document.querySelector(".go-back")
        ) {
          clearInterval(setDrag);
          console.log("取消執行");
        }
        let dragDiv = document.querySelector(".go-back"); //移動物體本身
        let dropArea = document.querySelector("body"); //移動範圍div
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

        dragDiv.addEventListener("click", goBack);
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

        function goBack() {
          if (!window.clickFalg && !checkMobile()) return; //若非手機且旗標為false則return
          alertService.confirm({
            title: t("app.dialog.gohome.title"),
            text: t("app.dialog.gohome.text"),
            confirmCallback: callback,
            heightAuto: true,
          });
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

          async function callback() {
            alertService.showLoading();
            // let res = await axios.post("/app/user/lock-credit", {
            //   //解鎖額度
            //   lock: 0,
            // });
            let res = await store.dispatch("app/set/unlock");
            alertService.close();
            clearInterval(setDrag);
            if (res) {
              router.push("/home");
            }
          }
        }
      }, 1500);
    });

    return {};
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/scss/play.scss";
</style>
