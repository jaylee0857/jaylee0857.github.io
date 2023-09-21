<template>
  <Marquee :texts="data" />
</template>
<script setup>
import { computed } from "vue";
import { useBulletinStore } from "@/store/bulletin-store";
import { useI18nService } from "@/services/i18n-service";

/** component */
import Marquee from "@/widgets/marquee";

/** hooks */
const bulletinStore = useBulletinStore();
const { t } = useI18nService();

const data = computed(() => {
  return [
    ...bulletinStore.marquees.map((marquee) => marquee.title),
    ...bulletinStore.withdraws.map((withdraw) =>
      t("pages.home.marquee.withdraw", {
        time: withdraw.updated_at,
        acc: setString(withdraw.account),
        cre: +withdraw.credit,
      })
    ),
  ];
});

const setString = (str) => {
  let first = str.substr(0, 2); //取首2字
  let last = str.substr(-2, 2); //取後2字
  return `${first}****${last}`;
};
</script>
