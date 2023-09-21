<template>
  <div class="creates name">
    <div class="lebel">{{ t("pages.bank.field.name") }}</div>
    <div class="text-[#7e7e80]">{{ bankCard.bankbook_username }}</div>
  </div>
  <div class="create__ex">
    {{ t("pages.bank.field.description") }}
  </div>
  <div class="creates">
    <div class="lebel">{{ t("pages.bank.field.status") }}</div>
    <div class="text-[#7e7e80]">
      {{ t(`pages.bank.field.status.${bankCard.status}`) }}
    </div>
  </div>
  <div class="creates">
    <div class="lebel">{{ t("pages.bank.field.bank") }}</div>
    <div class="text-[#7e7e80]">
      {{ bankCard.bank_name }}
    </div>
  </div>
  <div class="creates enteraccount">
    <div class="lebel">{{ t("pages.bank.field.bankid") }}</div>
    <div class="text-[#7e7e80]">
      {{ bankCard.bankbook_account }}
    </div>
  </div>
  <div class="creates addfile" v-if="bankCard.bankbook_cover">
    <div class="lebel">
      <img :src="`data:image/png;base64, ${bankCard.bankbook_cover}`" alt="" />
    </div>
  </div>
  <div class="creates addfile" v-if="bankCard.user_id_image">
    <div class="lebel">
      <img :src="`data:image/png;base64, ${bankCard.user_id_image}`" alt="" />
    </div>
  </div>
  <div class="creates addfile" v-if="bankCard.selfie_image">
    <div class="lebel">
      <img :src="`data:image/png;base64, ${bankCard.selfie_image}`" alt="" />
    </div>
  </div>
  <div class="create__ex bg-w">
    {{ t("pages.bank.field.finalcheck") }}
  </div>
  <div class="question create pb-10">
    {{ t("pages.bank.add.notice.line.2") }}
    <router-link to="/service" class="link">
      {{ t("pages.bank.add.notice.line.2.params.0") }}
    </router-link>
  </div>
</template>
<script setup>
import { storeToRefs } from "pinia";

/** stores */
import { usePaymentStore } from "@/store/payment-store";

/** service */
import { useI18nService } from "@/services/i18n-service";

defineOptions({
  layout: "layout-trade",
  title: "pages.bank.cards.my.button",
});

const { t } = useI18nService();
const paymentStore = usePaymentStore();
const { bankCard } = storeToRefs(paymentStore);

//
</script>
<style lang="scss" scoped>
@import "@/assets/scss/withdraw.scss";
</style>
