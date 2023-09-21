<template>
  <div class="page__record">
    <div class="main">
      <ul v-if="form.length !== 0">
        <li v-for="item in form" :key="item.date" class="w-full">
          <div class="items page_record_item w-full">
            <span class="w-50 mr-2"
              >{{ t("pages.trade.take") }}{{ item.date }}</span
            >
            <span class="w-50"
              >{{ t("pages.trade.take.amount")
              }}{{ (~~item.total_amount).toFixed(0) }}</span
            >
          </div>
          <!--共兩層 v-for 日期/紀錄 -->
        </li>
      </ul>
      <ul v-else style="margin-top: 0.2rem">
        <li>
          <div class="items">{{ t("pages.promote.record.empty") }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { useI18nService } from "@/services/i18n-service";
import { useHttpService } from "@/services/http-service";

export default {
  layout: "layout-trade",

  setup() {
    const http = useHttpService();
    const { t } = useI18nService();
    const form = ref([]);

    const getList = async () => {
      let res = await http.get("/app/promotion-records/received");
      if (res.code !== 1) return;
      console.log(res);
      form.value = res.data;
    };

    const setTitle = () => {
      document.querySelector(".title").textContent = t(
        "pages.promote.record.title"
      );
    }; //設定標題

    onMounted(() => {
      setTitle();
      getList();
    });
    return {
      t,
      form,
    };
  },
};
</script>
<style lang="sass" scoped>
@import "@/assets/scss/recommend.scss"
</style>
