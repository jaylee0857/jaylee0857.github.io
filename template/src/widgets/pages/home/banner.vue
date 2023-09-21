<template>
  <Banner :items="data.banners">
    <template #bird="{ data }">
      <div class="bg_bird text-[#422205]" @click="onDetail('bird')">
        <div class="h-20 flex justify-center items-center text-30">
          {{ t("pages.home.banner.bird") }}
        </div>
        <div
          class="pt-4 h-60 grid grid-rows-5 grid-flow-col justify-center gap-x-24 gap-y-1"
        >
          <div
            v-for="(item, index) in data.items.slice(0, 10)"
            :key="index"
            class="w-[1.3rem] flex justify-start items-center space-x-1"
          >
            <img :src="rankIcon(index)" class="w-10 h-10" />
            <span class="max-w-[2rem] text-24">
              {{ item.account }}
            </span>
          </div>
        </div>
        <div
          class="mt-7 pl-8 w-40 flex justify-center items-center font-light text-20 text-white"
        >
          {{ t("pages.home.banner.detail") }}
        </div>
      </div>
    </template>
    <template #snake="{ data }">
      <div class="bg_snake text-[#FFF6C4]" @click="onDetail('snake')">
        <div class="h-20 flex justify-center items-center text-30">
          {{ t("pages.home.banner.snake") }}
        </div>
        <div class="h-60 -space-x-4 text-20">
          <div class="h-40 flex justify-center items-center text-white">
            <div
              class="flex justify-center items-center flex-col"
              v-if="data.items[1]"
            >
              <img
                class="w-[1.2rem] h-[1.2rem] rounded-full"
                :src="data.items[1].avatar"
              />
              <img
                class="mt-[-1.32rem] w-[1.35rem] h-[1.45rem]"
                src="@/assets/images/home/banner_frame_2.png"
              />
              <img
                class="w-44 h-8"
                src="@/assets/images/home/banner_account_2.png"
              />
              <span class="mt-[-0.3rem] h-7">
                {{ data.items[1].account }}
              </span>
            </div>
            <div class="w-[1.76rem]" v-else />
            <div
              class="mt-16 flex justify-center items-center flex-col"
              v-if="data.items[0]"
            >
              <img
                class="w-[1.25rem] h-[1.25rem] rounded-full"
                :src="data.items[0].avatar"
              />
              <img
                class="mt-[-1.65rem] w-[1.45rem] h-[1.75rem]"
                src="@/assets/images/home/banner_frame_1.png"
              />
              <img
                class="w-44 h-8"
                src="@/assets/images/home/banner_account_1.png"
              />
              <span class="mt-[-0.3rem] h-7">
                {{ data.items[0].account }}
              </span>
            </div>
            <div class="w-[1.76rem]" v-else />
            <div
              class="flex justify-center items-center flex-col"
              v-if="data.items[2]"
            >
              <img
                class="w-[1.2rem] h-[1.2rem] rounded-full"
                :src="data.items[2].avatar"
              />
              <img
                class="mt-[-1.32rem] w-[1.35rem] h-[1.45rem]"
                src="@/assets/images/home/banner_frame_3.png"
              />
              <img
                class="w-44 h-8"
                src="@/assets/images/home/banner_account_3.png"
              />
              <span class="mt-[-0.3rem] h-7">
                {{ data.items[2].account }}
              </span>
            </div>
            <div class="w-[1.76rem]" v-else />
          </div>
          <div class="mt-8 h-20 flex justify-center space-x-20 text-[#422205]">
            <div class="flex justify-center items-center" v-if="data.items[3]">
              <span class="mx-2 font-sans text-30">4</span>
              <img
                class="w-[0.575rem] h-[0.575rem] rounded-full"
                :src="data.items[3].avatar"
              />
              <img
                class="ml-[-0.585rem] w-[0.6rem] h-[0.6rem]"
                src="@/assets/images/home/banner_frame_4.png"
              />
              <span class="mx-4">
                {{ data.items[3].account }}
              </span>
            </div>
            <div class="flex justify-center items-center" v-if="data.items[4]">
              <span class="mx-2 font-sans text-30">5</span>
              <img
                class="w-[0.575rem] h-[0.575rem] rounded-full"
                :src="data.items[4].avatar"
              />
              <img
                class="ml-[-0.585rem] w-[0.6rem] h-[0.6rem]"
                src="@/assets/images/home/banner_frame_4.png"
              />
              <span class="mx-4">
                {{ data.items[4].account }}
              </span>
            </div>
          </div>
        </div>
        <div
          class="mt-7 pl-8 w-40 flex justify-center items-center font-light text-20 text-white"
        >
          {{ t("pages.home.banner.detail") }}
        </div>
      </div>
    </template>
    <template #banner="{ data }">
      <img
        v-lazy="{
          src: data?.isDefault ? data.mobile_image : url + data.mobile_image,
          loading: beforeImage,
        }"
        :src="data?.isDefault ? data.mobile_image : url + data.mobile_image"
        class="w-full h-full object-cover"
        @click="toBannerUrl(data)"
      />
    </template>
  </Banner>
</template>
<script setup>
import { reactive, computed } from "vue";
import { usePopupStore } from "@/store/popup-store";
import { useBannerStore } from "@/store/banner-store";
import { useI18nService } from "@/services/i18n-service";

import { bannerImage, rankIcon } from "@/imageRouter";
import beforeImage from "@/assets/images/banner/banner_default_sm_bg.png";
import avatarDefault from "@/assets/images/account/user_avatar_default.webp";

import Banner from "@/widgets/banner";
import rankDetail from "@/widgets/popup/home/rank-detail";

import { map, assoc, pipe } from "ramda";

/** hooks */
const bannerStore = useBannerStore();
const popupStore = usePopupStore();
const { t } = useI18nService();

const url = import.meta.env.VITE_REMOTE_IMAGES + "/";

const data = reactive({
  banners: computed(() => {
    let bannerDatas = [];
    switch (bannerStore.banners.length) {
      case 0:
        bannerDatas = bannerImage().map((image) => ({
          mobile_image: image,
          mobile_url: "",
          isDefault: true,
        }));
        break;
      case 1:
        if (data.birds.length || data.snakes.length)
          bannerDatas = bannerStore.banners;
        else bannerDatas = [...bannerStore.banners, ...bannerStore.banners];
        break;
      default:
        bannerDatas = bannerStore.banners;
        break;
    }

    const assocBannerTemplate = map(assoc("template", "banner"), bannerDatas);
    const assocBirdTemplate = data.birds.length
      ? [{ template: "bird", items: data.birds }]
      : [];
    const assocSnakeTemplate = data.snakes.length
      ? [{ template: "snake", items: data.snakes }]
      : [];
    return [
      ...assocBirdTemplate,
      ...assocSnakeTemplate,
      ...assocBannerTemplate,
    ];
  }),
  birds: computed(() =>
    pipe(
      map((bird) => ({
        ...bird,
        avatar: avatar(bird.avatar),
        account: maskAccount(bird.account),
      }))
    )(bannerStore.birds)
  ),
  snakes: computed(() =>
    pipe(
      map((snake) => ({
        ...snake,
        avatar: avatar(snake.avatar),
        account: maskAccount(snake.account),
      }))
    )(bannerStore.snakes)
  ),
});

const toBannerUrl = (item) => {
  if (item.mobile_url === "") return; //空字串則return
  let isAndroid = navigator.userAgent.indexOf("Mac") === -1; //判斷裝置 有掃到Mac為 iPhone and iPad
  if (isAndroid) {
    return window.open(item.mobile_url);
  }
  document.location.href = item.mobile_url;
};

const avatar = (img) =>
  img ? new URL(img, import.meta.env.VITE_REMOTE_IMAGES).href : avatarDefault;

/** 帳號遮碼： 123456 -> 12**56 */
const maskAccount = (account) => {
  if (!account) return;
  return account.replace(/(.{2})(.*)(.{2})/, (match, p1, p2, p3) => {
    // let middle = "*".repeat(p2.length);
    // // 如果中間字元數超過10，就只顯示前10個和省略號
    // if (p2.length > 10) {
    //   middle = middle.substring(0, 10);
    // }
    // return p1 + middle + p3;
    return p1 + "***" + p3; // 固定三顆*
  });
};

const onDetail = (type) => {
  popupStore.rank({
    component: rankDetail,
    title: t(`pages.activity.hint.${type}`),
    showCancelButton: false,
    props: {
      list: data[`${type}s`],
    },
  });
};
</script>

<style lang="scss" scoped>
.bg_bird {
  background-image: url("@/assets/images/home/banner_bg_bird.png");
  background-size: 7.125rem 3.8rem;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
}

.bg_snake {
  background-image: url("@/assets/images/home/banner_bg_snake.png");
  background-size: 7.125rem 3.8rem;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
}
</style>
