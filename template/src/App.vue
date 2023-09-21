<template>
  <!-- 外層利用is載入layout -->
  <component :is="layout" :key="lang">
    <!-- 內層利用router顯示 透過解構賦值 取得從router-view取得的component 在把Component用在:is＝"Component"身上-->
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </component>

  <the-popup />
  <the-chat />
</template>

<script>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";

/** services */
import { useI18nService } from "@/services/i18n-service";

/** workflows */
import { useAppWorkflow } from "./workflows/app-workflow";
import { useAuthWorkflow } from "./workflows/auth-workflow";
import { useBulletinWorkflow } from "./workflows/bulletin-workflow";
import { useNotifyWorkflow } from "./workflows/notify-workflow";
import { useGameWorkflow } from "./workflows/game-workflow";
import { useChatWorkflow } from "./workflows/chat-workflow";
import { useDiscountWorkflow } from "./workflows/discount-workflow";
import { usePaymentWorkflow } from "./workflows/payment-workflow";

/** helper */
import { isNil, defaultTo, path } from "ramda";

export default {
  setup() {
    const route = useRoute();
    const store = useStore();
    const i18nService = useI18nService();
    const appWorkflow = useAppWorkflow();
    const authWorkflow = useAuthWorkflow();
    const bulletinWorkflow = useBulletinWorkflow();
    const notifyWorkflow = useNotifyWorkflow();
    const gameWorkflow = useGameWorkflow();
    const chatWorkflow = useChatWorkflow();
    const discountWorkflow = useDiscountWorkflow();
    const paymentWorkflow = usePaymentWorkflow();

    const layout = computed(() => {
      /* 一開始都是 undefined */
      /* isNil為檢查空值，為null或undefined則return null */
      if (isNil(route.path)) return null;
      /* 拿設定的 layout，預設是 default-layout */
      const currentLayout = defaultTo(null)(path(["meta", "layout"], route));
      // defaulto的功用就是給預設值
      // 這邊的用法是先設定defaultTo預設值，
      // 緊接著馬上用設置好的預設值下去執行再return結果給變數
      // 所以才會是兩個（）（）分別代表執行了兩次fn，設置及使用
      // 分解大概長這樣：
      // const default = defaultTo("layout-error");
      // default(path(["meta", "layout"], route))
      return currentLayout;
    });

    const setEnvDate = (setEnv = null) => {
      const env = setEnv || import.meta.env.MODE;
      store.commit("app/set/env", env);
    };

    /** created */
    setEnvDate();
    appWorkflow.initial();
    authWorkflow.initial();
    bulletinWorkflow.initial();
    notifyWorkflow.initial();
    gameWorkflow.initial();
    chatWorkflow.initial();
    discountWorkflow.initial();
    paymentWorkflow.initial();

    onMounted(() => {
      const computeSize = () => {
        /* 設計尺寸： 750 * 1334 */
        /* 字體大小隨著螢幕寬度更改 */
        document.getElementsByTagName("html")[0].style = `font-size: ${
          (document.body.clientWidth / 750) * 100
        }px`;
      };
      computeSize();
      window.addEventListener("resize", computeSize);
    });

    return {
      layout,
      lang: i18nService.locale,
    };
  },
};
</script>
