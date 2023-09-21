<template>
  <iframe v-show="url !== ''" id="iframe" :src="url" frameborder="0"></iframe>
  <div
    v-show="url === ''"
    class="empty flex justify-center items-center w-full h-full"
  >
    {{ t("app.game.empty") }}
  </div>
</template>
<script>
import { useStore } from "vuex";
import { ref, onMounted } from "vue";
import { useI18nService } from "@/services/i18n-service";

export default {
  layout: "layout-play",

  setup() {
    const store = useStore();
    const { t } = useI18nService();
    // const router = useRouter();
    const url = ref(store.state.app.gameUrl);
    // if (url.value === "") router.push("/home");
    const setScript = () => {
      let pinnacleOrigin = ".tender88.com";
      window.addEventListener("message", (event) => {
        // check pinnacle origin
        if (
          event.origin &&
          event.origin.toLowerCase().endsWith(pinnacleOrigin)
        ) {
          let postData = event.data;
          switch (postData.action) {
            case "OPEN_WINDOW":
              url.value = postData.url;
              break;
          }
        }
      });
    };
    onMounted(() => {
      window.onbeforeunload = unlock;
      window.onpopstate = unlock;
      function unlock() {
        store.dispatch("app/set/unlock");
      }
      document.querySelector("#iframe").addEventListener("load", setScript);
      // Allow window to listen for a postMessage
    });
    return {
      url,
      t,
    };
  },
  //   beforeRouteEnter(to, from, next) {
  //     console.log(store.state);
  //     if (to.path === "/play" && from.path === "/home") {
  //       next({ name: "/login" });
  //       return;
  //     }
  //     next();
  //   },
};
</script>
<style lang="scss" scoped>
iframe {
  width: 100%;
  height: 100%;
}
.empty {
  font-size: 0.4rem;
  white-space: pre-line;
}
</style>
