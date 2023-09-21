<template>
  <div class="illustrate-paging">
    <div class="illustrate-paging-block">
      <h1>{{ currentMessages("atm.question") }}</h1>
      <img src="@/assets/images/trade/illustrate_ATM.png" alt="" />
      <p>
        {{ currentMessages("atm.answer") }}
      </p>
    </div>
    <div class="illustrate-paging-block">
      <h2>
        {{ currentMessages("cvs.question") }}
      </h2>
      <div class="caption">
        {{ currentMessages("cvs.answer") }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18nService } from "@/services/i18n-service";
const { scope } = useI18nService();
const { t: currentMessages } = scope("pages.deposit.illustrate");
</script>

<style lang="scss" scoped>
@import "@/assets/scss/topup.scss";
</style>
