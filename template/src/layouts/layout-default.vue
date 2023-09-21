<template>
  <div class="pb-32">
    <slot />
  </div>

  <div class="fixed bottom-0 left-0 w-full z-10">
    <div v-if="nav.type" class="nav z-10 show">
      <ul
        v-if="nav.type === 'wallet'"
        v-bg-image-load:image="{
          old: getImageUrl('background_main_wallet_sm.png'),
          cover: getImageUrl('background_main_wallet.png'),
          custom: 'height: 100%;border-radius: 40px 40px 0 0;z-index: -1',
        }"
      >
        <li>
          <router-link :to="routeTo['topup']">
            <span
              class="icon nav-icon topup"
              :class="{
                'notify-tip red': tips.deposit,
              }"
            ></span>
            <span>{{ t("app.menu.deposit") }}</span>
          </router-link>
        </li>
        <li>
          <router-link :to="routeTo['withdraw']">
            <span
              class="icon nav-icon withdraw"
              :class="{
                'notify-tip red': tips.withdraw,
              }"
            ></span>
            <span>{{ t("app.menu.withdraw") }}</span>
          </router-link>
        </li>
        <li>
          <router-link :to="routeTo['recommend']">
            <span
              class="icon nav-icon recommend"
              :class="{
                'notify-tip red': tips.recommend,
              }"
            ></span>
            <span>{{ t("app.menu.promote.alias") }}</span>
          </router-link>
        </li>
      </ul>
      <ul
        v-if="nav.type === 'service'"
        class="service"
        v-bg-image-load:image="{
          old: getImageUrl('background_main_wallet_sm.png'),
          cover: getImageUrl('background_main_wallet.png'),
          custom: 'height: 100%;border-radius: 40px 40px 0 0;z-index: -1',
        }"
      >
        <li v-for="data in nav.list" :key="data.icon">
          <a target="_blank" :href="data.page">
            <span class="icon" :class="data.icon"></span>
            <span>{{ data.name }}</span>
          </a>
        </li>
      </ul>
    </div>

    <div
      class="relative z-20 flex flex-shrink-0 flex-grow-0 justify-around items-center bottom-nav whitespace-nowrap"
    >
      <router-link
        to="/home"
        v-slot="{ isActive }"
        class="bottom-nav__item bottom-nav__item--home"
        @click="closeNav"
      >
        <span :class="[isActive && 'bottom-nav__item--active']">
          {{ t("app.bottomNav.home") }}
        </span>
      </router-link>

      <!-- 錢包 -->
      <a
        href="#"
        class="bottom-nav__item bottom-nav__item--wallet"
        :class="{
          'notify-tip red': tips.deposit || tips.withdraw || tips.recommend,
        }"
        @click.prevent="callNav('wallet')"
      >
        {{ t("app.bottomNav.wallet") }}
      </a>

      <!-- 優惠 -->
      <router-link
        :to="routeTo['discount']"
        class="bottom-nav__item bottom-nav__item--discount"
        :class="{ 'notify-tip red': tips.discount }"
        @click="closeNav"
      >
        {{ t("app.bottomNav.discount") }}
      </router-link>

      <!-- 客服 -->
      <a
        to="#"
        class="bottom-nav__item bottom-nav__item--service whitespace-nowrap"
        @click.prevent="openChatPopup"
      >
        {{ t("app.bottomNav.service") }}
      </a>

      <!-- 我的 -->
      <router-link
        :to="routeTo['account']"
        class="bottom-nav__item bottom-nav__item--account"
        @click="closeNav"
      >
        {{ t("app.bottomNav.account") }}
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from "vue";
import { useNotifyStore } from "@/store/notify-store";
import { useI18nService } from "@/services/i18n-service";
import { useChatWorkflow } from "@/workflows/chat-workflow";
import { getImageUrl } from "@/tool";

const { t } = useI18nService();
const notifyStore = useNotifyStore();
const chatWorkflow = useChatWorkflow();

const tips = reactive({
  discount: computed(
    () => notifyStore.isTip("promote") || notifyStore.isTip("promote_map")
  ),
  withdraw: computed(() => notifyStore.isTip("activity_deposit_withdraw")),
  deposit: computed(() => notifyStore.isTip("deposit")),
  promote: computed(() => notifyStore.isTip("promotion_mia")),
});

const routeTo = {
  topup: { path: "/topup", state: { from: "存款" } },
  withdraw: { path: "/withdraw", state: { from: "取款" } },
  recommend: { path: "/recommend", state: { from: "推廣" } },
  discount: { path: "/discount", state: { from: "優惠" } },
  account: { path: "/account", state: { from: "我的" } },
};

const nav = reactive({
  list: [],
  type: null,
});

const openChatPopup = async () => {
  const { success, payload } = await chatWorkflow.excute();
  if (!success) {
    const { zaloUrl = null, lineUrl = null } = payload;
    let list = [];
    if (lineUrl) {
      list = [
        ...list,
        {
          icon: "line",
          page: lineUrl,
          name: t("app.menu.line"),
          blank: true,
        },
      ];
    }
    if (zaloUrl) {
      list = [
        ...list,
        {
          icon: "zalo",
          page: zaloUrl,
          name: t("app.menu.zalo"),
          blank: true,
        },
      ];
    }
    if (list.length) {
      nav.list = list;
      callNav("service");
    }
  }
};

const callNav = (type = null) => {
  /* 一樣type就關閉 */
  if (type === nav.type) closeNav();
  else nav.type = type;
};

const closeNav = () => {
  nav.type = null;
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/layout.scss";
.layout-show {
  visibility: visible;
}
.layout-hide {
  visibility: hidden;
}
.notify-tip {
  &::before {
    right: 0.4rem;
    top: 3px;
  }
  &.nav-icon {
    &::before {
      right: -4px;
      top: 2px;
    }
  }
}
</style>
