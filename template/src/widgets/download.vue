<template>
  <div
    class="download"
    v-show="isShow"
    @click.self="download"
    :class="{
      en: locale === 'en',
      top: inTopModes.includes(env),
      ph: locale === 'ph',
    }"
  >
    <span @click.self="download">{{ t("app.dialog.download.title") }}</span>
    <div class="close" @click="close"></div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { inject, ref, onMounted, computed } from "vue";
import { useI18nService } from "@/services/i18n-service";
import { useAlertService } from "@/services/alert-service";
import { openUrl } from "@/tool";

export default {
  props: ["account"],
  setup(props) {
    const { t, locale } = useI18nService();
    const alertService = useAlertService();
    const storage = inject("$storage");
    const store = useStore();
    const env = computed(() => store.state.app.env);
    const inTopModes = ["phivip"];
    const isShow = ref(false);
    const url = {
      android: computed(() => store.state.app.download.apk_url),
      iphone: computed(() => store.state.app.download.ipa_url),
    };
    const close = () => {
      console.log("關閉");
      let arr = storage.get("download") || [];
      isShow.value = false;
      let now = new Date().getTime();
      let obj = {
        time: now,
        account: props?.account,
      };
      arr.push(obj);
      storage.set("download", arr);
    };
    /* 判斷是否顯示 */
    const setShow = () => {
      let temp = {};
      if (!props?.account) return;
      let account = props?.account;
      let arr = storage.get("download") || [];
      arr.forEach((data) => {
        if (data.account === account) {
          temp = data;
        }
      });

      /* 若有紀錄 */
      if (temp?.account) {
        /* 若有關閉紀錄則確認時間有沒有過一天了 */
        let now = new Date().getTime();
        /* 若有紀錄的時間往後推一天大於現在時間的話，表示已經超過一天，故顯示。 */
        if (temp.time + 86400000 < now) return (isShow.value = true);
      } else {
        /* 若原本就沒有關閉紀錄 直接顯示 */
        isShow.value = true;
      }
    };
    const download = () => {
      let isAndroid = navigator.userAgent.indexOf("Mac") === -1; //判斷裝置 有掃到Mac為 iPhone and iPad
      // alert(navigator.userAgent);
      alertService.confirm({
        title: t("app.dialog.download.title"),
        text: t("app.dialog.download.text"),
        confirmCallback: () => {
          if (isAndroid) {
            return window.open(url.android.value);
          }
          // document.location.href = url.iphone;
          openUrl(url.iphone.value);
        },
      });
    };
    const getUrl = async () => {
      let res = await store.dispatch("app/get/downloadUrl");
      /* 若url取失敗，連判斷顯示與否都不需要 */
      if (res !== 1) return;
      setShow();
    };
    onMounted(() => {
      getUrl();
    });
    return {
      t,
      close,
      download,
      env,
      locale,
      isShow,
      inTopModes,
    };
  },
};
</script>

<style lang="scss" scoped>
.download {
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: fixed;
  padding-left: 0.55rem;
  right: 0;
  top: 9.2rem;
  width: 1.6rem;
  height: 0.6rem;
  font-size: 0.22rem;
  font-weight: bold;
  white-space: nowrap;
  background-image: url("@/assets/images/icon_download_float.png");
  background-size: cover;
  background-repeat: no-repeat;
  z-index: 9;
  &.top {
    top: 7.3rem;
  }
  &.ph,
  &.en {
    span {
      white-space: pre;
      line-height: 1;
      scale: 0.9;
    }
    .close {
      top: -0.25rem;
    }
  }
  .close {
    position: absolute;
    right: 0.1rem;
    top: -0.15rem;
    width: 0.4rem;
    height: 0.4rem;
    background-image: url("@/assets/images/icon_download_float_delete.png");
    background-size: cover;
    background-repeat: no-repeat;
  }
}
.en {
  font-size: 0.2rem !important;
}
</style>
