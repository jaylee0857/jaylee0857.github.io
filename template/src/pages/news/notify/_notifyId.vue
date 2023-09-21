<template>
  <template v-if="article">
    <div class="head">
      <div class="icon"></div>
      <div class="title">
        <div class="text">【{{ article.title }}】</div>
        <div class="time">{{ article.created_at }}</div>
      </div>
    </div>
    <div class="main">
      {{ article.content }}
    </div>
  </template>
  <div v-else class="main text-center">Not Found.</div>
</template>
<script>
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useBulletinStore } from "@/store/bulletin-store";

export default {
  layout: "layout-content",
  title: "app.page.news.activity.content",
  setup() {
    const bulletinStore = useBulletinStore();
    const route = useRoute();
    const article = computed(() => {
      return bulletinStore.notifies.find(
        (activity) => activity.id.toString() === route.params["notifyid"]
      );
    });
    const setContentHeight = () => {
      let wrap = document.querySelector(".layout-content");
      wrap.style.height = wrap.style.width = 100 + "%";
      wrap.style.position = "fixed";
      wrap.style.left = wrap.style.bottom = 0;
      document.querySelector(
        ".layout-content-main"
      ).style.height = `calc(100% - 0.96rem)`;
      let elem = document.querySelector(".head");
      if (!elem) return;
      let height = window
        .getComputedStyle(elem, null)
        .getPropertyValue("height");
      document.querySelector(".main").style.height = `calc(100% - ${height})`;
    };

    onMounted(() => {
      setContentHeight();
    });

    return {
      article,
      icon,
    };
  },
};
</script>
<style lang="scss" scoped>
.submit--enabled {
  background-image: linear-gradient(to right, #74aef8, #4a70f1);
}
.head {
  display: flex;
  align-items: center;
  margin-top: 0.3rem;
  min-height: 10%;
  border-top: 1px solid #c3c3c3;
  border-bottom: 1px solid #c3c3c3;
  background: #fff;
  word-break: break-all;
  .icon {
    margin: 0 0.1rem;
    width: 0.8rem;
    min-width: 0.8rem;
    height: 0.8rem;
    background-image: url("@/assets/images/icon_message_notification.webp");
    background-size: cover;
    background-repeat: no-repeat;
  }
  .title {
    flex-grow: 1;
    padding: 0.1rem 0.2rem;
    .time {
      font-size: 0.2rem;
      color: #c3c3c3;
    }
    .text {
      margin-left: -0.2rem;
      font-size: 0.35rem;
    }
  }
}
.main {
  padding: 0.2rem;
  height: 90%;
  font-size: 0.3rem;
  word-break: break-all;
  white-space: pre-wrap;
  background: #fff;
  overflow-y: overlay;
  overflow-x: hidden;
  // background: red;
}
</style>
