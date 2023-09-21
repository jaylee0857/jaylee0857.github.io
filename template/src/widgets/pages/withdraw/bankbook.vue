<template>
  <div class="account bg-w margin-t">
    <div class="label">
      <div>
        <span class="required">*</span>
        {{ t("pages.withdraw.form.bank") }}
      </div>
      <div class="ex margin-t-sm" v-if="!record">
        {{ t("pages.withdraw.form.bank.empty") }}
      </div>
    </div>
    <div class="account__content">
      <div v-if="!record" class="add__card">
        <router-link to="/bankbook">
          <span class="icon">＋</span>
          <span>
            {{ t("pages.withdraw.to.wallet.bank") }}
          </span>
        </router-link>
      </div>

      <div v-else-if="status === 0" class="add__card">
        <router-link to="/bankbook">
          {{ t("pages.withdraw.bankcard.review") }}
        </router-link>
      </div>

      <div v-else-if="status === 3" class="add__card">
        <router-link to="/bankbook" class="add__card__href">
          {{ t("pages.withdraw.bankcard.reject") }}
          <div class="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              height="100%"
              width="100%"
              class="fill-current"
            >
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path
                d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"
              />
            </svg>
          </div>
        </router-link>
      </div>
      <div v-else class="card">
        <span class="card__account" v-text-fit="{ fontSizeRange: 2 }">
          {{ record.bankbook_account }}
        </span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from "vue";
import { useI18nService } from "@/services/i18n-service";
const { t } = useI18nService();

const props = defineProps({
  record: Object,
});

const status = computed(() => props.record?.status);
</script>
<style lang="scss" scoped>
@import "@/assets/scss/withdraw.scss";
</style>
