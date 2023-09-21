<template>
  <div class="home__action" v-if="!isLoggedIn">
    <router-link
      class="home__action__link home__action__link--login"
      v-bg-image-load:image="{
        old: getImageUrl('home/btn_icon_register_sm2.png'),
        cover: getImageUrl('home/btn_icon_register2.png'),
      }"
      :to="{ path: '/login', state: { from: '登入按鈕' } }"
    >
      <span>
        {{ t("pages.login.title") }}
      </span>
    </router-link>
    <router-link
      v-bg-image-load:image="{
        old: getImageUrl('home/btn_icon_login_sm2.png'),
        cover: getImageUrl('home/btn_icon_login2.png'),
      }"
      class="home__action__link home__action__link--register"
      :class="{ ph: locale === 'ph' }"
      :to="{ path: '/signup', state: { from: '註冊按鈕' } }"
    >
      <span>
        {{ t("pages.register.title") }}
      </span>
    </router-link>
  </div>
  <!-- 會員顯示介面 -->
  <div class="home__user__action" v-else>
    <div class="user__data">
      <div class="user__account">
        <div class="account">{{ user.account ?? "" }}</div>
        <div class="vip__bg" :class="`v${user.vip?.vip ?? '0'}`">VIP</div>
      </div>
      <div class="user__credit">
        <div class="user__icon money"></div>
        <div class="mr-1.5" :class="{ 'text-gray-300': refreshFlag }">
          {{ parseInt(user?.credit ?? "0") }}
        </div>
        <div
          ref="refreshRef"
          class="text-28 text-[#3d72fa] !leading-none"
          @click="onReFresh"
        >
          <i class="fas fa-sync-alt"></i>
        </div>
      </div>
    </div>
    <div class="user__action" :class="{ ph: locale.value === 'ph' }">
      <router-link to="/withdraw" class="item">
        <div
          class="user__icon withdraw"
          :class="{ 'notify-tip red': tips.withdraw }"
        ></div>
        <div>
          {{ t("app.menu.info.withdraw") }}
        </div>
      </router-link>
      <router-link to="/discount" class="item">
        <div
          class="user__icon promotion"
          :class="{ 'notify-tip red': tips.discount }"
        ></div>
        <div>
          {{ t("app.menu.info.activity") }}
        </div>
      </router-link>
      <router-link to="/recommend" @click="onForwardRecommend" class="item">
        <div
          class="user__icon commission"
          :class="{ 'notify-tip red': tips.promote }"
        ></div>
        <div>
          {{ t("app.menu.info.promote") }}
        </div>
      </router-link>
      <router-link to="/ranking" class="item">
        <div class="user__icon chart"></div>
        <div>
          {{ t("app.menu.info.ranking") }}
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from "vue";
import { useStore } from "vuex";
import { useI18nService } from "@/services/i18n-service";
import { useAuthStore } from "@/store/auth-store";
import { useNotifyStore } from "@/store/notify-store";
import { useAuthWorkflow } from "@/workflows/auth-workflow";
import { getImageUrl } from "@/tool";
import gsap from "gsap";

const refreshFlag = ref(false);
const refreshRef = ref(null);
const store = useStore(); //取得store
const authStore = useAuthStore();
const notifyStore = useNotifyStore();
const { t, locale } = useI18nService();
const authWorkflow = useAuthWorkflow();
const user = computed(() => authStore.user);
const isLoggedIn = computed(() => authStore.isLogin);
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
});
const onReFresh = async () => {
  let animate;
  return authWorkflow.updateCredit({
    setLoading: (flag) => {
      if (flag) {
        animate = gsap.to(refreshRef.value, {
          rotation: 360,
          repeat: -1,
          transformOrigin: "45% 45%",
          duration: 1,
        });
      } else {
        animate?.kill();
        gsap.set(refreshRef.value, { rotation: 0, duration: 0 });
      }
      refreshFlag.value = flag;
    },
  });
};

const onForwardRecommend = () => {
  store.dispatch("app/read/recommendIndex", 1);
};

onMounted(() => {
  if (isLoggedIn.value && user.value.lock_credit) {
    onReFresh();
  }
});
</script>
