<template>
  <div class="table w-full">
    <div class="th flex item-center bg-white">
      <div class="flex flex-col justify-center items-center w-self">
        {{ t("pages.leaderboard.title.account") }}
      </div>
      <div class="flex flex-col justify-center items-center w-self">
        <span>
          {{ t("pages.leaderboard.title.total_withdraw") }}
        </span>
      </div>
      <div class="flex flex-col justify-center items-center w-self">
        <span>
          {{ t("pages.leaderboard.title.last_deposit") }}
        </span>
      </div>
    </div>
    <div
      class="td flex items-center bg-white"
      v-for="(item, index) in list"
      :key="index"
    >
      <p class="flex justify-center items-center w-self">{{ item.account }}</p>
      <p class="flex justify-center items-center w-self">
        {{ item.account }}
        <span v-show="item.nickname">({{ item.nickname }})</span>
      </p>
      <p class="flex justify-center items-center w-self">
        {{ setPoint(item.amount) }}
      </p>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { useI18nService } from "@/services/i18n-service";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
// import { getDateForamt } from "@/date";
export default {
  layout: "layout-trade",

  setup() {
    const { t } = useI18nService();
    const store = useStore();
    const router = useRouter();
    const list = ref([]);

    const setTitle = (type) => {
      let title;
      switch (type) {
        case "deposit":
          title = t("pages.promote.descendants.table.head.deposit");
          break;
        case "withdraw":
          title = t("pages.promote.descendants.table.head.withdraw");
          break;
        case "bet_valid":
          title = t("pages.promote.descendants.table.head.bet");
          break;
        case "bet_result":
          title = t("pages.promote.report.win");
          break;
        case "pmt_amount":
          title = t("pages.promote.report.discount");
          break;
      }
      document.querySelector(".title").textContent = title;
    }; //設定標題

    const getList = async () => {
      if (store.state.app.reportType === "") return router.push("/report");
      setTitle(store.state.app.reportType);
      list.value = store.state.app.report;
      console.log(store.state.app.report);
    };

    const setPoint = (str) => {
      const temp = str.split(",");
      return ~~temp.join("");
    };

    onMounted(() => {
      getList();
      // 待實際資料
    });
    return {
      t,
      setPoint,
      list,
    };
  },
};
</script>
<style lang="scss" scoped>
.table {
  overflow-y: overlay;
  font-size: 0.3rem;
  .th {
    // padding: 0.3rem;
    background: #f8f8f8;
    & > div {
      padding: 0.15rem;
      background: #fff;
    }
  }
  .td {
    margin: 0.1rem 0;
    padding: 0.2rem 0;
  }
  .td:nth-child(1) {
    color: red;
  }
}
.w-self {
  width: 30%;
  margin: 0 1.6%;
  margin-top: 0.15rem;
  margin-bottom: 0.05rem;
}
// @import "@/assets/scss/recommend.scss"
</style>
