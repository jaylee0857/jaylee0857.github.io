<template>
  <div class="payment arrive bg-w font-sans overflow-x-hidden">
    <div class="payment-wallet">
      <CreditInfo :wash-amount="washAmountCompute" />
    </div>
    <div class="payment-foot">
      <div
        class="payment__progress"
        :class="{ 'payment__progress--full': !activity }"
      >
        <WashProgress :record="washAmountCompute" />
      </div>
      <ChestBox v-if="!!activity" />
    </div>
  </div>
  <div class="payment-link">
    <router-link to="/discount">
      <div class="btn-icon promotion"></div>
      <div class="text">
        {{ t("app.menu.info.activity") }}
      </div>
    </router-link>
    <router-link to="/ranking">
      <div class="btn-icon chart"></div>
      <div class="text">
        {{ t("app.menu.info.ranking") }}
      </div>
    </router-link>
  </div>

  <div class="margin-t bg-w amount">
    <div class="content">
      <TextField
        v-model="form.amount"
        pattern="\d*"
        :title="t('pages.withdraw.form.money')"
        :placeholder="
          t('pages.withdraw.form.money.placeholder.enter', {
            max: limit.max,
            min: limit.min,
          })
        "
        inline
        required
      />
    </div>
  </div>

  <DallorAccum
    class="margin-t bg-w"
    :title="t('pages.withdraw.form.amount')"
    :options="[300, 500, 1000, 3000, 5000, 10000, 15000, 20000]"
    v-model="form.amount"
    required
  />

  <Bankbook :record="bankCard" />

  <div class="footer pb-10">
    <div class="submit" :class="{ disabled: form.invalid }" @click="onSubmit">
      {{ t("pages.withdraw.form.submit") }}
    </div>
    <router-link class="question margin-t" to="/service">
      <div v-html="t('pages.withdraw.to.service')"></div>
    </router-link>
  </div>
</template>
<script setup>
import { reactive, computed, defineOptions } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/store/auth-store";
import { usePaymentStore } from "@/store/payment-store";
import { useI18nService } from "@/services/i18n-service";
import { useWithdrawWorkflow } from "@/workflows/pages/withdraw-workflow";

/** components */
import DallorAccum from "@/widgets/dallor-accum.vue";
import CreditInfo from "@/widgets/pages/withdraw/credit-info.vue";
import WashProgress from "@/widgets/pages/withdraw/wash-progress.vue";
import ChestBox from "@/widgets/pages/withdraw/chest-box.vue";
import Bankbook from "@/widgets/pages/withdraw/bankbook.vue";
import TextField from "@/widgets/text-field.vue";

/** helper */
import { isEmpty } from "ramda";

defineOptions({
  layout: "layout-trade",
  title: "pages.withdraw.form.submit",
});

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const paymentStore = usePaymentStore();
const { washAmount, bankCard, activity, channel } = storeToRefs(paymentStore);
const { t } = useI18nService();
const withdrawWorkflow = useWithdrawWorkflow();

withdrawWorkflow.created();

const form = reactive({
  invalid: computed(
    () =>
      form.amount === "" ||
      form.amount < limit.min ||
      form.amount > limit.max ||
      bankCard.value?.status !== 1 ||
      isEmpty(user.value.phone)
  ),
  amount: "",
});

/** 洗馬量 */
const washAmountCompute = computed(() => {
  let percent = 0,
    achieve = 0,
    total = 0;

  if (washAmount.value) {
    //已達標金額 不可超過洗碼量限制 為負數時就是已超過
    //公式為 當前洗碼量 = 限制總額 - 達標差額
    const { total_wash_limit, diff_amount } = washAmount.value;

    if (total_wash_limit > 0) {
      //換算達標%數
      percent = ((total_wash_limit - diff_amount) / total_wash_limit) * 100;
      achieve = ~~(total_wash_limit - diff_amount);
      total = total_wash_limit;
    }
  }

  percent = Math.min(percent, 100);
  percent = Math.max(percent, 3);

  return {
    achieve,
    total,
    percent,
  };
});

const limit = reactive({
  min: computed(() => channel.value?.floor ?? 0),
  max: computed(() => channel.value?.ceiling ?? 0),
});

const onSubmit = async () => {
  /** 驗證不通過 */
  if (form.invalid) return;

  await withdrawWorkflow.onSubmit({
    amount: form.amount,
  });

  /** 成功失敗都清空 */
  // eslint-disable-next-line require-atomic-updates
  form.amount = "";
};
</script>
<style lang="scss" scoped>
@import "@/assets/scss/withdraw.scss";
</style>
