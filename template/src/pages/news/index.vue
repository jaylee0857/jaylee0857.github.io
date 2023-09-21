<template>
  <ul class="tag">
    <li
      v-for="(item, index) in tags"
      class="flex w-1/2 justify-center items-center"
      :key="item"
      :class="{
        isActive: item.isActive,
        'text-center': locale === 'en' || locale === 'vi',
      }"
      @click="toSlide(index)"
    >
      {{ item.text }}
      <div class="line"></div>
    </li>
  </ul>
  <Swiper class="h-[91%]" @swiper="onSwiper" @slideChange="onChanged">
    <!-- slideChange在切換slide時會觸發 用於切換header的tag-->
    <Swiper-slide class="teach__slide">
      <div class="bg" v-if="news.notifies.length === 0">
        <div class="img"></div>
        <div class="text">{{ t("pages.news.no.message") }}</div>
      </div>
      <div v-else class="news__list">
        <router-link
          v-for="(item, index) in news.notifies"
          :key="'notify' + index"
          :to="`/news/notify/${item.id}`"
        >
          <div class="icon"></div>
          <div class="article">
            <div class="limit title">
              <span class="news__text"> 【{{ item.title }}】 </span>
              <span class="news__date">
                {{ item.created_at.split(" ").shift() }}
              </span>
            </div>
            <div class="limit content">{{ item?.content }}</div>
          </div>
        </router-link>
      </div>
    </Swiper-slide>
    <Swiper-slide class="teach__slide">
      <div class="bg" v-if="news.activities.length === 0">
        <div class="img"></div>
        <div class="text">{{ t("pages.news.no.message") }}</div>
      </div>
      <div v-else class="news__list">
        <router-link
          v-for="(item, index) in news.activities"
          :key="index"
          :to="`/news/activity/${item.id}`"
        >
          <div class="icon"></div>
          <div class="article">
            <div class="limit title">
              <span class="news__text"> 【{{ item.title }}】 </span>
              <span class="news__date">
                {{ item.created_at.split(" ").shift() }}
              </span>
            </div>
            <div class="limit content">{{ item?.content }}</div>
          </div>
        </router-link>
      </div>
    </Swiper-slide>
  </Swiper>
</template>
<script>
import { onMounted, reactive, ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useBulletinStore } from "@/store/bulletin-store";
import { useI18nService } from "@/services/i18n-service";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";

export default {
  layout: "layout-trade",
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    const bulletinStore = useBulletinStore();
    const route = useRoute();
    const router = useRouter();
    const { t, locale } = useI18nService();
    const swiperController = ref();
    const tags = ref([
      {
        text: t("pages.news.tab.notify"),
        isActive: route.query.type !== "activity",
      },
      {
        text: t("pages.news.tab.activity"),
        isActive: route.query.type === "activity",
      },
    ]);

    const news = reactive({
      activities: computed(() => bulletinStore.activities),
      notifies: computed(() => bulletinStore.notifies),
    });

    const setTitle = () => {
      document.querySelector(".title").textContent = t("app.page.news");
    }; //設定標題

    const onSwiper = (swiper) => {
      swiperController.value = swiper;
      swiper.activeIndex = +(route.query.type === "activity");
    };
    const onChanged = (e) => {
      router.replace({
        path: "/news",
        query: { type: ["notify", "activity"][e.activeIndex] },
      });
    };
    const toSlide = (index) => {
      router.replace({
        path: "/news",
        query: { type: ["notify", "activity"][index] },
      });
    };

    watch(
      () => route.query.type,
      (type) => {
        if (type === "activity") {
          tags.value[0].isActive = false;
          tags.value[1].isActive = true;
          swiperController.value.slideTo(1);
        } else {
          tags.value[0].isActive = true;
          tags.value[1].isActive = false;
          swiperController.value.slideTo(0);
        }
      }
    );

    onMounted(() => {
      setTitle();

      /** 已讀所有未讀訊息 */
      bulletinStore.readAllMessages();
    });

    return {
      t,
      onSwiper,
      onChanged,
      toSlide,
      tags,
      news,
      locale,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/scss/recommend.scss";
.line {
  left: 50% !important;
  width: 35% !important;
  transform: translate(-50%, -50%) !important;
}

.news__list {
  background: #fff;
  a {
    display: flex;
    align-items: center;
    border-bottom: 0.5px solid #c3c3c3;
    .icon {
      margin: 0 0.1rem;
      width: 0.8rem;
      min-width: 0.8rem;
      height: 0.8rem;
      background-image: url("@/assets/images/icon_message_notification.webp");
      background-size: cover;
      background-repeat: no-repeat;
    }
    .article {
      flex-grow: 1;
      padding: 0.1rem 0.2rem;
      // letter-spacing: 1.3px;
      overflow: hidden;
      .title {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-left: -0.2rem;
        font-size: 0.35rem;
        font-weight: 500;
        .news__text {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .news__date {
          // position: absolute;
          // right: 0;
          // top: 0;
          color: #c3c3c3;
          font-size: 0.2rem;
        }
      }
      .content {
        font-size: 0.3rem;
        // color: #c3c3c3;
      }
    }
  }
}

.limit {
  width: 100%;
  height: 0.5rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.bg {
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .img {
    width: 3rem;
    height: 3rem;
    background-image: url("@/assets/images/news_image_empty.webp");
    background-size: cover;
    background-repeat: no-repeat;
  }
  .text {
    text-align: center;
    font-size: 0.3rem;
    color: #c3c3c3;
  }
}
</style>
