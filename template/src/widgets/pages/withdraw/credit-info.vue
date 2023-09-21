<template>
  <div class="payment-wallet-amount">
    <div class="payment-wallet-amount__row">
      <p class="payment-wallet-amount__title">
        {{ t("pages.withdraw.wallet") }}
      </p>
      <p
        class="payment-wallet-amount__dallor"
        :class="{ 'text-gray-300': refreshFlag }"
        v-text-fit
      >
        {{ Number(~~(user?.credit ?? "0")).toLocaleString() }}
      </p>
    </div>
    <div class="payment-wallet-amount__row">
      <p class="payment-wallet-amount__title">
        {{ t("pages.withdraw.bet.amount") }}
        <span class="question-mark" @click="onTipToast"></span>
      </p>
      <p class="payment-wallet-amount__dallor" v-text-fit>
        {{ Number(washAmount.achieve).toLocaleString() }} /
        {{ Number(washAmount.total).toLocaleString() }}
      </p>
    </div>
  </div>
  <div class="payment-wallet-refresh">
    <div class="icon" @click="onReFresh"></div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/store/auth-store";
import { useI18nService } from "@/services/i18n-service";
import { useAlertService } from "@/services/alert-service";
import { useAuthWorkflow } from "@/workflows/auth-workflow";

/** helper */
import gsap from "gsap";

defineProps({
  washAmount: Object,
});

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const { t } = useI18nService();
const alertService = useAlertService();
const authWorkflow = useAuthWorkflow();
const refreshFlag = ref(false); //額度重整游標

/** 額度更新 */
const onReFresh = async (e) => {
  let animate;
  return authWorkflow.updateCredit({
    setLoading: (flag) => {
      if (flag) {
        animate = gsap.to(e.target, {
          rotation: 360,
          repeat: -1,
          transformOrigin: "center",
          duration: 1,
        });
      } else {
        animate?.kill();
        gsap.set(e.target, { rotation: 0, duration: 0 });
      }
      refreshFlag.value = flag;
    },
  });
};

/** tip click */
const onTipToast = () => {
  alertService.toast(
    `${t(`pages.withdraw.bet.achieve`)} / ${t(`pages.withdraw.bet.achieve.no`)}`
  );
};
</script>
<style lang="scss" scoped>
@import "@/assets/scss/withdraw.scss";
</style>
