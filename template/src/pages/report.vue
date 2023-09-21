<template>
  <div class="head">
    <div
      class="btn"
      v-for="(item, index) in form.date"
      :key="item.text"
      :class="{ active: item.isActive }"
      @click="onSelect(index)"
    >
      {{ item.text }}
    </div>
  </div>
  <div class="table w-full">
    <div class="col">
      <input
        type="checkbox"
        style="margin-right: 0.1rem"
        v-model="form.is_self"
        @change="getList"
      />
      <p>{{ t("pages.promote.report.own") }}</p>
    </div>
    <!-- 存款量 -->
    <div class="col">
      <div class="title">
        <div class="icon topup"></div>
        <div>{{ t("pages.promote.descendants.table.head.deposit") }}</div>
      </div>
      <div class="content" @click="checkDetail('deposit')">
        <div>${{ setPoint(list.deposit) }}</div>
        <div class="icon arrow"></div>
      </div>
    </div>
    <!-- 提款量 -->
    <div class="col">
      <div class="title">
        <div class="icon withdraw"></div>
        <div>{{ t("pages.promote.descendants.table.head.withdraw") }}</div>
      </div>
      <div class="content" @click="checkDetail('withdraw')">
        <div>${{ setPoint(list.withdraw) }}</div>
        <div class="icon arrow"></div>
      </div>
    </div>
    <!-- 打碼量 -->
    <div class="col">
      <div class="title">
        <div class="icon bet"></div>
        <div>{{ t("pages.promote.descendants.table.head.bet") }}</div>
      </div>
      <div class="content" @click="checkDetail('bet_valid')">
        <div>${{ setPoint(list.bet_valid) }}</div>
        <div class="icon arrow"></div>
      </div>
    </div>
    <!-- 輸贏狀況 -->
    <div class="col">
      <div class="title">
        <div class="icon win"></div>
        <div>{{ t("pages.promote.report.win") }}</div>
      </div>
      <div class="content" @click="checkDetail('bet_result')">
        <div>${{ setPoint(list.bet_result) }}</div>
        <div class="icon arrow"></div>
      </div>
    </div>
    <!-- 優惠總額 -->
    <div class="col">
      <div class="title">
        <div class="icon discount"></div>
        <div>{{ t("pages.promote.report.discount") }}</div>
      </div>
      <div class="content" @click="checkDetail('pmt_amount')">
        <div>${{ setPoint(list.pmt_amount) }}</div>
        <div class="icon arrow"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useI18nService } from "@/services/i18n-service";
import { useAlertService } from "@/services/alert-service";

export default {
  layout: "layout-trade",

  setup() {
    const alertService = useAlertService();
    const { t } = useI18nService();
    const store = useStore();
    const router = useRouter();
    const form = reactive({
      date: [
        {
          text: t("pages.promote.descendants.selection.today"),
          posted: "today",
          isActive: true,
        },
        {
          text: t("pages.promote.descendants.selection.yesterday"),
          posted: "yesterday",
          isActive: false,
        },
        {
          text: t("pages.leaderboard.tab.0"),
          posted: "this_week",
          isActive: false,
        },
        {
          text: t("pages.leaderboard.tab.2"),
          posted: "this_month",
          isActive: false,
        },
      ],
      list: {
        deposit: 0,
        withdraw: 0,
        bet_valid: 0,
        bet_result: 0,
        pmt_amount: 0,
      },
      is_self: false, //是否包含自己 0 無 1有
      selectDate: "today",
    });
    const list = ref({
      deposit: 0,
      withdraw: 0,
      bet_valid: 0,
      bet_result: 0,
      pmt_amount: 0,
    });

    const onSelect = (i) => {
      //切換日期
      form.date.forEach((data, index) => {
        data.isActive = false;
        if (index == i) {
          data.isActive = true;
          form.selectDate = data.posted;
          getList();
        }
      });
    };

    const setTitle = () => {
      document.querySelector(".title").textContent = t(
        "pages.promote.report.title"
      );
    }; //設定標題

    const getList = async () => {
      alertService.showLoading();
      //依照傳入的id進行活動的載入 num則為往後天數
      let request = {
        is_self: form.is_self ? 1 : 0,
        date_range: form.selectDate,
      };
      let res = await store.dispatch("app/get/report", request);
      console.log(res);
      alertService.close();
      if (res.code !== 1)
        return alertService.alert({
          title: t("app.dialog.system.title2"),
          text: t("pages.bank.modify.empty"),
        });
      list.value = res.data;
      console.log(list);
    };

    const setPoint = (str) => {
      return ~~str;
    };

    const checkDetail = async (type) => {
      alertService.showLoading();
      let request = {
        action: type,
        is_self: form.is_self ? 1 : 0,
        date_range: form.selectDate,
      };
      let isGot = await store.dispatch("app/get/report/detail", request);
      alertService.close();

      if (!isGot)
        return alertService.alert({
          title: t("app.dialog.system.title2"),
          text: t("feedback.action.failed"),
        });
      router.push("/report/detail");
    };

    onMounted(() => {
      setTitle();
      getList();
    });
    return {
      t,
      getList,
      onSelect,
      setPoint,
      checkDetail,
      form,
      list,
    };
  },
};
</script>
<style lang="scss" scoped>
.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.2rem;
  padding-top: 0.2rem;
  font-size: 0.3rem;
  overflow: overlay;
  .btn {
    margin: 0 0.1rem;
    padding: 0.1rem 0.5rem;
    color: #fff;
    background: #c3c3c3;
    border-radius: 6px 6px 0 0;
    white-space: nowrap;
  }
  .btn:nth-child(1) {
    margin-left: 0.1rem;
  }
  .btn:nth-child(4) {
    margin-right: 0.1rem;
  }
  .btn.active {
    background: linear-gradient(to top, #b6936e 0%, #dec69e 100%);
  }
}
.table {
  font-size: 0.35rem;
  background: #fff;
  .col {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.2rem;
    border-bottom: 0.5px solid #d5cece;
    .icon {
      margin-right: 0.1rem;
      width: 0.6rem;
      height: 0.6rem;
      background-size: cover;
      background-repeat: no-repeat;
    }
    .icon.arrow {
      width: 0.18rem;
      height: 0.3rem;
      background-image: url("@/assets/images/withdraw/icon_arrow_right.webp");
      margin-left: 0.45rem;
      margin-right: 0;
    }
    .icon.topup {
      background-image: url("@/assets/images/trade/icon_monryInfo_savings.png");
    }
    .icon.withdraw {
      background-image: url("@/assets/images/trade/icon_monryInfo_withdrawal.png");
    }
    .icon.bet {
      background-image: url("@/assets/images/trade/icon_monryInfo_bet.png");
    }
    .icon.discount {
      background-image: url("@/assets/images/trade/icon_monryInfo_discount.png");
    }
    .icon.win {
      background-image: url("@/assets/images/trade/icon_monryInfo_win.png");
    }
    &:nth-child(1) {
      justify-content: flex-end;
      padding-bottom: 0.4rem;
      font-size: 0.3rem;
      background: #f8f8f8;
      input {
        width: 0.3rem;
        height: 0.3rem;
      }
    }
    .content,
    .title {
      display: flex;
      align-items: center;
    }
  }
}
// @import "@/assets/scss/recommend.scss"
</style>
