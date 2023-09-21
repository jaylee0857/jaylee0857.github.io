<template>
  <div class="layout pb-8">
    <div class="sticky top-0 left-0 w-full h-24 z-30 bg-[#940008]">
      <the-header>
        <template v-slot:title>
          <div class="text-white font-normal">
            {{ rootMessages("app.page.account") }}
          </div>
        </template>
        <template v-slot:actions>
          <div class="flex justify-center items-center space-x-8">
            <router-link to="/account/setting">
              <img
                class="w-11 h-11"
                src="@/assets/images/account/icon_setting.svg"
              />
            </router-link>
            <router-link to="/news">
              <img
                class="w-11 h-11"
                src="@/assets/images/account/icon_messenger_true.svg"
                v-if="hasUnreadBulletins"
              />
              <img
                class="w-11 h-11"
                src="@/assets/images/account/icon_messenger.svg"
                v-else
              />
            </router-link>
          </div>
        </template>
      </the-header>
    </div>

    <div class="pt-4 pb-[1rem]">
      <router-link to="/account/profile" class="vip-info">
        <div class="vip-info__background">
          <img :src="vipImage.normal" class="w-full h-full" />
        </div>
        <div class="vip-info__avatar">
          <img
            :src="avatar"
            class="w-full h-full overflow-hidden rounded-full"
          />
        </div>
        <div class="vip-info__title">
          {{ linkMessages(`member.title.${user.vip?.vip ?? 0}`) }}
        </div>
        <div class="vip-info__account">
          {{ user.account }}
        </div>
      </router-link>
      <div
        class="mr-10 ml-auto w-min px-6 text-26 text-center text-white font-sans whitespace-nowrap"
        v-if="vipState"
      >
        <div v-if="vipState === 2">
          {{ vipMessages("1") }}
          <span class="text-[#E39B12]">{{ ~~vipReciprocal + 1 }}</span>
          {{ vipMessages("2") }}
        </div>
        <div v-else :class="`label-${locale}`">
          <div>{{ vipMessages("settlement") }}</div>
        </div>
      </div>
    </div>

    <div
      class="absolute w-full h-20 bg-white rounded-[0.2rem]"
      :class="vipState ? `tab_clip-${locale} mt-[-1.17rem]` : 'mt-[-0.9rem]'"
    >
      <div
        class="pl-[0.3rem] pt-6 text-[#424553] font-normal text-30 whitespace-nowrap"
      >
        {{ promoteMessages("title") }}
      </div>
    </div>
    <div
      class="bg-white px-8 pt-[0.52rem] rounded-b-md rounded-t-[0.2rem]"
      :class="vipState ? 'mt-[-0.8rem]' : 'mt-[-0.5rem]'"
    >
      <router-link
        to="/recommend"
        class="rounded bg-white block promote"
        :class="{ 'notify-tip --after red': tips.promote }"
      >
        <div class="flex justify-around items-center">
          <div class="w-56 flex-shrink-0 flex-grow-0">
            <div class="icon-account-amount"></div>
            <!-- <img
              src="@/assets/images/account/btn_receive_my.png"
              class="promote__icon mx-auto my-0"
            /> -->
          </div>
          <div class="flex w-full divide-x divide-black divide-opacity-5">
            <div
              class="promote__pick w-full flex justify-center items-center flex-col"
            >
              <div class="promote__pick__credit">
                {{ ~~commission.current }}
              </div>
              <div class="promote__pick__title" style="color: #828387">
                {{ promoteMessages("pick") }}
              </div>
            </div>
            <div
              class="promote__pick w-full flex justify-center items-center flex-col"
            >
              <div class="promote__pick__credit">
                {{ ~~commission.tomorrow }}
              </div>
              <div class="promote__pick__title" style="color: #828387">
                {{ promoteMessages("pick.tomorrow") }}
              </div>
            </div>
          </div>
        </div>
      </router-link>

      <div class="py-8">
        <div class="grid grid-cols-3 gap-y-8">
          <router-link
            to="/topup"
            class="w-full flex flex-col justify-center items-center px-4"
            :class="{ 'notify-tip --after red': tips.deposit }"
          >
            <div class="icon-account-deposit"></div>
            <div
              class="text-24 font-semibold color-base text-center"
              v-text-fit="{ fontSizeRange: 2 }"
            >
              {{ rootMessages("app.page.deposit") }}
            </div>
          </router-link>
          <router-link
            to="/withdraw"
            class="divide-min w-full flex flex-col justify-center items-center px-4"
            :class="{ 'notify-tip --after red': tips.withdraw }"
          >
            <div class="icon-account-withdraw"></div>
            <div
              class="text-24 font-semibold color-base text-center"
              v-text-fit="{ fontSizeRange: 2 }"
            >
              {{ rootMessages("app.page.withdraw") }}
            </div>
          </router-link>
          <router-link
            to="/recommend"
            class="divide-min w-full flex flex-col justify-center items-center px-4"
            :class="{ 'notify-tip --after red': tips.promote }"
          >
            <div class="icon-account-promotion"></div>
            <div
              class="text-24 font-semibold color-base text-center"
              v-text-fit="{ fontSizeRange: 2 }"
            >
              {{ rootMessages("app.menu.promote.alias") }}
            </div>
          </router-link>
          <router-link
            to="/betting"
            class="w-full flex flex-col justify-center items-center px-4"
            :class="{ 'notify-tip --after red': tips.bet }"
          >
            <div class="icon-account-bet-records"></div>
            <div
              class="text-24 font-semibold color-base text-center"
              v-text-fit="{ fontSizeRange: 2 }"
            >
              {{ linkMessages("bets") }}
            </div>
          </router-link>
          <router-link
            to="/transaction"
            class="divide-min w-full flex flex-col justify-center items-center px-4"
          >
            <div class="icon-account-transaction-records"></div>
            <div
              class="text-24 font-semibold color-base text-center"
              v-text-fit="{ fontSizeRange: 2 }"
            >
              {{ linkMessages("transactions") }}
            </div>
          </router-link>
          <router-link
            to="/bankbook"
            class="divide-min w-full flex flex-col justify-center items-center px-4"
          >
            <div class="icon-account-management"></div>
            <div
              class="text-24 font-semibold color-base text-center"
              v-text-fit="{ fontSizeRange: 2 }"
            >
              {{ linkMessages("profile") }}
            </div>
          </router-link>
          <!-- 小紅包遊戲 -->
          <a
            class="w-full flex flex-col justify-center items-center px-4"
            @click.prevent="toRedPacket"
          >
            <div class="icon-account-envelope"></div>
            <div
              class="text-24 font-semibold color-base text-center"
              v-text-fit="{ fontSizeRange: 2 }"
            >
              {{ linkMessages("redpacket") }}
            </div>
          </a>
          <!-- 下載 -->
          <a
            v-if="url.canDownload"
            @click.prevent="onDownload"
            class="divide-min w-full flex flex-col justify-center items-center px-4"
          >
            <div class="icon-account-download"></div>
            <div
              class="text-24 font-semibold color-base text-center"
              v-text-fit="{ fontSizeRange: 2 }"
            >
              {{ rootMessages("app.dialog.download.title") }}
            </div>
          </a>
          <!-- 序號對獎 -->
          <router-link
            to="/receive"
            class="divide-min w-full flex flex-col justify-center items-center px-4"
          >
            <div class="icon-ticket"></div>
            <div
              class="text-24 font-semibold color-base text-center"
              v-text-fit="{ fontSizeRange: 2 }"
            >
              {{ linkMessages("receive") }}
            </div>
          </router-link>
          <!-- 收益報表 -->
          <router-link
            to="/report"
            v-if="canCheckReport.isShow"
            class="w-full flex flex-col justify-center items-center px-4"
          >
            <div class="icon-account-envelope"></div>
            <div
              class="text-24 font-semibold color-base text-center"
              v-text-fit="{ fontSizeRange: 2 }"
            >
              {{ rootMessages("pages.promote.report.title") }}
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <!-- 語系 -->
    <a
      href="#"
      @click.prevent="openLocaleSwitcher"
      class="bg-white mt-5 py-8 px-6 px-r-coustom w-full flex justify-between items-center"
    >
      <div class="flex items-center space-x-5">
        <img
          class="w-14 h-14"
          src="@/assets/images/account/account_icon_language.svg"
        />
        <div class="color-base text-28">
          {{ linkMessages("languages") }}
        </div>
      </div>
      <div class="flex items-center space-x-6">
        <div class="text-24 text-[#929292]">
          {{ linkMessages("languages.desc") }}
        </div>
        <img
          class="w-8 h-8"
          src="@/assets/images/account/icon_arrow_right.png"
        />
      </div>
    </a>

    <a
      href="#"
      @click.prevent="openAnimationSwitcher"
      class="bg-white mt-5 py-8 px-6 px-r-coustom w-full flex justify-between items-center"
    >
      <div class="flex items-center space-x-5">
        <img class="w-14 h-14" src="@/assets/images/account/icon_help.png" />
        <div class="color-base text-28">
          {{ linkMessages("animation") }}
        </div>
      </div>
      <div class="flex items-center space-x-6">
        <div class="text-24 text-[#929292]">
          {{
            linkMessages(`animation.${appStore.animationSwitch ? "on" : "off"}`)
          }}
        </div>
        <img
          class="w-8 h-8"
          src="@/assets/images/account/icon_arrow_right.png"
        />
      </div>
    </a>

    <router-link
      to="/account/helper"
      class="bg-white mt-5 py-8 px-6 px-r-coustom flex justify-between focus:bg-gray-200"
    >
      <div class="flex w-full justify-start items-center space-x-5">
        <img
          class="w-14 h-14"
          src="@/assets/images/account/account_icon_helpcenter.webp"
        />
        <div class="color-base text-28 whitespace-nowrap">
          {{ linkMessages("helper.center") }}
        </div>
      </div>
      <div class="flex w-full justify-end items-center space-x-5">
        <div class="text-24 text-[#929292]">
          {{ linkMessages("helper.center.desc") }}
        </div>
        <img
          class="w-8 h-8"
          src="@/assets/images/account/icon_arrow_right.png"
        />
      </div>
    </router-link>

    <router-link
      to="/account/about"
      class="bg-white mt-5 py-8 px-6 px-r-coustom flex justify-between focus:bg-gray-200"
    >
      <div class="flex w-full justify-start items-center space-x-5">
        <img
          class="w-14 h-14"
          src="@/assets/images/account/account_icon_info.webp"
        />
        <div class="color-base text-28 whitespace-nowrap">
          {{ linkMessages("about") }}
        </div>
      </div>
      <div class="flex justify-center items-center">
        <img
          class="w-8 h-8"
          src="@/assets/images/account/icon_arrow_right.png"
        />
      </div>
    </router-link>
  </div>
</template>

<script setup>
import { computed, reactive, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { useAuthStore } from "@/store/auth-store";
import { useAppStore } from "@/store/app-store";
import { useNotifyStore } from "@/store/notify-store";
import { useBulletinStore } from "@/store/bulletin-store";
import { useI18nService } from "@/services/i18n-service";
import { useAppWorkflow } from "@/workflows/app-workflow";
import { useGameWorkflow } from "@/workflows/game-workflow";
import { usePopupWorkflow } from "@/workflows/common/popup-workflow";
import { accountImage } from "@/imageRouter";
import { openUrl } from "@/tool";

/** components */
import BottomPicker from "@/widgets/popup/bottom-sheet/bottom-picker";

/** assets */
// import avatarDefault from "@/assets/images/account/user_avatar_default.webp";
import avatarDefault from "@/assets/images/account/user_avatar_default.png";

const store = useStore();
const appStore = useAppStore();
const authStore = useAuthStore();
const notifyStore = useNotifyStore();
const bulletinStore = useBulletinStore();
const { t: rootMessages, locale, setLocale, scope } = useI18nService();
const { t: linkMessages } = scope("pages.account.link");
const { t: vipMessages } = scope("pages.account.vip");
const { t: promoteMessages } = scope("pages.account.promote");
const appWorkflow = useAppWorkflow();
const gameWorkflow = useGameWorkflow();
const popupWorkflow = usePopupWorkflow();
const user = computed(() => authStore.user);
const hasUnreadBulletins = computed(
  () => bulletinStore.unreadMessages.length > 0
);
const tips = reactive({
  discount: computed(
    () => notifyStore.isTip("promote") || notifyStore.isTip("promote_map")
  ),
  withdraw: computed(() =>
    // notifyStore.isTip("wash_amount_complete") ||
    // notifyStore.isTip("activity_wash_amount") ||
    notifyStore.isTip("activity_deposit_withdraw")
  ),
  deposit: computed(() => notifyStore.isTip("deposit")),
  promote: computed(() => notifyStore.isTip("promotion_mia")),
  bet: computed(() => notifyStore.isTip("bet_record")),
});
const url = {
  android: computed(() => appStore.apkUrl),
  iphone: computed(() => appStore.ipaUrl),
  canDownload: computed(
    () => url.android.value !== "" && url.iphone.value !== ""
  ),
};
const vipReciprocal = ref(0); // vip倒數日
/** 畫面狀態
 * 0: 無 -> vip等級為0,1
 * 1: 顯示結算中 -> vipReciprocal < 4hr (0.1667)，
 * 2: 顯示倒數日 -> vipReciprocal > 4hr (0.1667) */
const vipState = computed(() => {
  switch (true) {
    case Number(user.value.vip?.vip ?? 0) < 2:
      return 0;
    case vipReciprocal.value > 0.167:
      return 2;
    case vipReciprocal.value > 0:
      return 1;
    default:
      return 0;
  }
});

const canCheckReport = reactive({ isShow: false });

const vipList = accountImage();

/** 圖像 */
const avatar = computed(() =>
  user.value.avatar
    ? new URL(user.value.avatar, import.meta.env.VITE_REMOTE_IMAGES).href
    : avatarDefault
);

/** VIP */
const vipImage = computed(() => vipList[user.value.vip?.vip ?? 0]);

/** 佣金 */
const commission = reactive({
  current: computed(() => user.value.commission ?? 0),
  tomorrow: 0,
});

/** 搶紅包次數 用於搶紅包顯示與否 */
// const playQuantity = ref(0);

/** 語系選擇器 */
const openLocaleSwitcher = async () => {
  const { isConfirmed, result } = await popupWorkflow.bottomSheet({
    component: BottomPicker,
    props: {
      options: [
        [
          { value: "tw", label: "繁中" },
          { value: "en", label: "English" },
          { value: "vn", label: "Việt Nam" },
          { value: "ph", label: "Pilipino" },
        ],
      ],
      value: [locale.value],
    },
  });

  if (isConfirmed && locale.value !== result.value[0]) {
    /**
     * 啟用 loading 做流程卡位
     * 在下方 timeout 一個等待時間
     * 讓其他語系監聽的行為可以處理
     * 處理完再彈 toast
     */
    const loadingStop = popupWorkflow.loadingStart();
    setLocale(result.value[0]);
    popupWorkflow.toast(rootMessages("feedback.save.success"));
    loadingStop(300);
  }
};

/** 動畫選擇器 */
const openAnimationSwitcher = async () => {
  const { isConfirmed, result } = await popupWorkflow.bottomSheet({
    component: BottomPicker,
    props: {
      options: [
        [
          { value: "true", label: linkMessages("animation.on") },
          { value: "false", label: linkMessages("animation.off") },
        ],
      ],
      value: [appStore.animationSwitch.toString()],
    },
  });

  if (isConfirmed) {
    appStore.setAnimationSwitch(result.value[0] === "true");
    popupWorkflow.toast(rootMessages("feedback.save.success"));
  }
};

const checkPermission = async () => {
  let res = await store.dispatch("app/get/permission", user.value.account);
  if (res.code !== 1) return;
  canCheckReport.isShow = res.data.status === 1;
};

const getVipDay = async () => {
  const res = await store.dispatch("app/read/rank");
  if (res.code === 1) {
    vipReciprocal.value = res.meta.reset_at.split(":")[0] / 24;
  }
};

const onDownload = () => {
  let isAndroid = navigator.userAgent.indexOf("Mac") === -1; //判斷裝置 有掃到Mac為 iPhone and iPad
  // alert(navigator.userAgent);
  popupWorkflow.confirm({
    title: rootMessages("app.dialog.download.title"),
    text: rootMessages("app.dialog.download.text"),
    confirmCallback: () => {
      if (isAndroid) window.open(url.android.value);
      else openUrl(url.iphone.value);
    },
  });
};

const toRedPacket = async () => {
  return gameWorkflow.playAddition();
};

onMounted(() => {
  store.dispatch("app/read/commissions").then((data) => {
    commission.tomorrow = data.tomorrow_receivable ?? 0;
  });
  checkPermission();
  getVipDay();

  appWorkflow.getDownloadUrl();

  window.addEventListener("pageshow", () => {
    /** 沒救了，強制刷新吧 */
    window.location.reload();
  });
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/account.scss";
</style>
