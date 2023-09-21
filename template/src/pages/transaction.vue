<template>
  <div class="betting h-full flex flex-col text-26">
    <section class="flex-none">
      <div
        class="inline-block"
        :class="{ active: trade.optionOpen === 1 }"
        @click="showOption(1)"
      >
        <p v-if="methods.data.length > 0">
          {{ methods.data[methods.selectItem].text }}
        </p>
        <span>▴</span>
      </div>
      <div
        class="inline-block"
        :class="{ active: trade.optionOpen === 2 }"
        @click="showOption(2)"
      >
        <p>{{ dateRange.data[dateRange.selectItem].rangeName }}</p>
        <span>▴</span>
      </div>
    </section>
    <div
      class="content transaction flex-1 relative overflow-hidden"
      :class="{
        'overflow-y-auto': trade.optionOpen === 0,
        empty: trade.allDataLenth === 0,
      }"
      :data-text="trade.emptyText"
    >
      <div
        class="options fixed w-full h-full"
        v-show="trade.optionOpen !== 0"
        style="margin-top: 0"
      >
        <!-- 方式 -->
        <div
          class="options-list flex h-full flex-col"
          v-show="trade.optionOpen === 1"
        >
          <div class="list platformOptions flex">
            <a
              href="javascript:void(0)"
              v-for="(item, index) in methods.data"
              :key="index"
              :class="{
                active: methods.selectItem === index,
              }"
              @click="selectMethods(index)"
              ><span class="wrap__font">{{ item.text }}</span></a
            >
          </div>
          <div class="flex-1 mask" @click="showOption(1)"></div>
        </div>
        <!-- 日期 -->
        <div
          class="options-list flex h-full flex-col"
          v-show="trade.optionOpen === 2"
        >
          <div class="tip">
            {{ t("pages.trade.selection.range.placeholder") }}
          </div>
          <div class="list flex">
            <a
              href="javascript:void(0)"
              v-for="(item, index) in dateRange.data"
              :key="index"
              :class="{
                active: dateRange.selectItem === index,
              }"
              @click="slectDateRange(index)"
              >{{ item.rangeName }}</a
            >
          </div>
          <div class="flex-1 mask" @click="showOption(2)"></div>
        </div>
      </div>
      <router-link
        :to="methods.selectItem === 1 ? '/withdraw' : '/topup'"
        class="toTopup"
        v-show="trade.allDataLenth === 0 && methods.selectItem !== 2"
        >{{
          methods.selectItem === 1
            ? t("pages.trade.button.go.withdraw")
            : t("pages.trade.button.go.deposit")
        }}</router-link
      >
      <div class="transaction__list" v-show="trade.optionOpen === 0">
        <div class="record" v-for="(item, index) in trade.list" :key="index">
          <div class="date">
            {{ t("pages.deposit.history", { M: item.month, d: item.day }) }}
          </div>
          <ul>
            <li
              v-for="data in item.list"
              :key="data.sn"
              @click="checkDetailed(data)"
            >
              <div class="icon" :class="trade.icon"></div>
              <div class="content">
                <div class="state">
                  <p class="method">
                    {{ trade.itemText }}
                  </p>
                  <p class="time" v-if="methods.selectItem === 2">
                    {{ data?.setData?.type }}
                  </p>
                  <p class="time" v-else>
                    {{
                      methods.selectItem === 1
                        ? data.setData.status
                        : data.setData.time
                    }}
                  </p>
                </div>
                <div class="sum">
                  {{ data?.points ? ~~data.points : ~~data.amount }}
                  <div class="icon"></div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <div class="detailed layout-trade" v-show="trade.showDetailed">
    <div class="header">
      <div class="go__back" @click.prevent="trade.showDetailed = false"></div>
      <div class="title">{{ t("app.page.trade.detail") }}</div>
      <div class="go__back" style="visibility: hidden"></div>
    </div>
    <div class="container__trade">
      <div class="detailed__main">
        <div class="detailed__amount">{{ trade.topupData.points }}</div>
        <div class="detailed__list topup" v-show="methods.selectItem === 0">
          <!-- 存款明細 -->
          <div class="item">
            <div class="detailed__label">
              {{ t("pages.trade.detail.form.type") }}
            </div>
            <div class="detailed__content">
              {{ t("pages.trade.selection.type.deposit") }}
            </div>
          </div>
          <div class="item">
            <div class="detailed__label">
              {{ t("pages.trade.detail.form.payment") }}
            </div>
            <div class="detailed__content">
              {{ trade.topupData?.setData?.payment }}
            </div>
          </div>
          <div class="item">
            <div class="detailed__label">
              {{ t("pages.trade.detail.form.status") }}
            </div>
            <div class="detailed__content">
              {{ trade.topupData?.setData?.status }}
            </div>
          </div>
          <div class="item">
            <div class="detailed__label">
              {{ t("pages.trade.detail.form.time") }}
            </div>
            <div class="detailed__content">{{ trade.topupData.create_at }}</div>
          </div>
          <div class="item">
            <div class="detailed__label">
              {{ t("pages.trade.detail.form.sn") }}
            </div>
            <div class="detailed__content">
              {{ trade.topupData.sn }}
              <p class="icon" @click="copyText(trade.topupData.sn)"></p>
            </div>
          </div>
        </div>
        <!-- 取款明細 -->
        <div class="detailed__list withdraw" v-show="methods.selectItem === 1">
          <div class="item">
            <div class="detailed__label">
              {{ t("pages.trade.detail.form.type") }}
            </div>
            <div class="detailed__content">
              {{ t("pages.trade.selection.type.withdraw") }}
            </div>
          </div>
          <div class="item">
            <div class="detailed__label">
              {{ t("pages.trade.detail.form.bank") }}
            </div>
            <div class="detailed__content">
              {{ trade.withdrawData.bank_name }}
            </div>
          </div>
          <div class="item">
            <div class="detailed__label">
              {{ t("pages.trade.detail.form.bank.account") }}
            </div>
            <div class="detailed__content">
              {{ trade.withdrawData.bank_account }}
            </div>
          </div>
          <div class="item">
            <div class="detailed__label">
              {{ t("pages.trade.detail.form.bank.user") }}
            </div>
            <div class="detailed__content">
              {{ trade.withdrawData.bank_user_name }}
            </div>
          </div>
          <div class="item">
            <div class="detailed__label">
              {{ t("pages.trade.detail.form.fee") }}
            </div>
            <div class="detailed__content">
              {{ trade.withdrawData.handling_fee }}
            </div>
          </div>
          <div class="item">
            <div class="detailed__label">
              {{ t("pages.trade.detail.form.status") }}
            </div>
            <div class="detailed__content">
              {{ trade.withdrawData?.setData?.status }}
            </div>
          </div>
          <div class="item">
            <div class="detailed__label">
              {{ t("pages.trade.detail.form.time") }}
            </div>
            <div class="detailed__content">
              {{ trade.withdrawData?.setData?.date }}
            </div>
          </div>
          <div class="item">
            <div class="detailed__label">
              {{ t("pages.trade.detail.form.sn") }}
            </div>
            <div class="detailed__content">
              {{ trade.withdrawData.sn }}
              <p class="icon" @click="copyText(trade.withdrawData.sn)"></p>
            </div>
          </div>
        </div>
        <!-- 贈點明細 -->
        <div class="detailed__list withdraw" v-show="methods.selectItem === 2">
          <div class="item">
            <div class="detailed__label">
              {{ t("pages.trade.detail.form.point_type") }}
            </div>
            <div class="detailed__content">
              {{ trade.pointData?.setData?.type }}
            </div>
          </div>
          <!-- 異動額度 -->
          <div class="item">
            <div class="detailed__label">
              {{ t("pages.trade.detail.form.before_amount") }}
            </div>
            <div class="detailed__content">
              {{ ~~trade.pointData.before_amount }}
            </div>
          </div>
          <div class="item">
            <div class="detailed__label">
              {{ t("pages.trade.detail.form.after_amount") }}
            </div>
            <div class="detailed__content">
              {{ ~~trade.pointData.after_amount }}
            </div>
          </div>
          <!-- 時間 -->
          <div class="item">
            <div class="detailed__label">
              {{ t("pages.trade.detail.form.time.created") }}
            </div>
            <div class="detailed__content">
              {{ trade.pointData.created_at }}
            </div>
          </div>
          <div class="item">
            <div class="detailed__label">
              {{ t("pages.trade.detail.form.time.completed") }}
            </div>
            <div class="detailed__content">
              {{ trade.pointData.completed_at }}
            </div>
          </div>
        </div>
        <div class="ex">
          {{ t("pages.trade.detail.notice.line.2") }}
          <router-link to="/service" class="link">
            {{ t("pages.trade.detail.notice.line.2.params.0") }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { reactive, onMounted } from "vue";
import { getDateForamt, getInterval } from "@/date";
import { useI18nService } from "@/services/i18n-service";
import { useHttpService } from "@/services/http-service";
import { useAlertService } from "@/services/alert-service";

export default {
  layout: "layout-trade",
  setup() {
    const http = useHttpService();
    const alertService = useAlertService();
    const { t, locale } = useI18nService();
    const dateRange = reactive({
      selectItem: 0,
      data: [
        { rangeName: t("pages.promote.descendants.selection.today") },
        {
          rangeName: t("pages.promote.descendants.selection.yesterday"),
        },
        {
          rangeName: t("pages.promote.descendants.selection.latest.days", {
            days: "7",
          }),
        },
        {
          rangeName: t("pages.promote.descendants.selection.latest.days", {
            days: "30",
          }),
        },
      ],
    });
    const methods = reactive({
      selectItem: 0, //0為存款 1為取款
      data: [
        { text: t("pages.trade.detail.form.type.deposit") },
        { text: t("pages.trade.detail.form.type.withdraw") },
        { text: t("pages.trade.detail.form.type.point") },
      ],
    }); //取款或存款選項

    const trade = reactive({
      optionOpen: 0,
      //切換tab開關
      allDataLenth: 0,
      //全部資料數量 決定背景顯示與否
      list: [],
      // 列表
      topupData: {
        points: "", //金額
        payment: "", //支付方式
        status: "", //狀態
        create_at: "", //交易時間
        sn: "", //訂單號碼
      },
      //存款明細
      withdrawData: {
        points: "", //金額
        bank_name: "", //取款銀行
        bank_user_name: "", //取款戶名
        bank_account: "", //取款帳號
        handling_fee: "", //手續費
        status: "", //狀態
        create_at: "", //時間
        sn: "", //單號
      },
      //贈點明細
      pointData: {
        type: "", //類型
        before_amount: "", //異動前額度
        after_amount: "", //異動後額度
        create_at: "", //建立時間
        completed_at: "", //完成時間
      },
      // 不同方式顯示的資料
      emptyText: "",
      itemText: "",
      icon: "",
      // 取款明細
      showDetailed: false,
      //明細資料顯示旗標
    });

    const setTitle = () => {
      document.querySelector(".title").textContent = t("app.page.trade");
    }; //設定標題

    const showOption = (type) => {
      trade.optionOpen = type === trade.optionOpen ? 0 : type;
    }; //顯示過濾選項

    const setMethodsText = (num) => {
      switch (num) {
        case 0:
          trade.emptyText = t("pages.trade.empty.deposit");
          trade.itemText = t("pages.trade.detail.form.type.deposit");
          trade.icon = "deposit";
          break;
        case 1:
          trade.emptyText = t("pages.trade.empty.withdraw");
          trade.itemText = t("pages.trade.detail.form.type.withdraw");
          trade.icon = "withdraw";
          break;
        case 2:
          trade.emptyText = t("pages.trade.empty.point");
          trade.itemText = t("pages.trade.detail.form.type.point");
          trade.icon = "point";
          break;
      }
    };

    const getSelectDay = (index) => {
      let num = 0;
      switch (index) {
        case 0: //今天
          num = 0;
          break;
        case 1: //昨天
          num = 1;
          break;
        case 2: //近7日
          num = 6;
          break;
        case 3: //近30日
          num = 29;
          break;
      }
      return num;
    };

    const selectMethods = (pid) => {
      trade.allDataLenth = 0;
      methods.selectItem = pid; //被選擇index
      trade.optionOpen = 0; //關閉過濾選項
      getRecordList(methods.selectItem, getSelectDay(dateRange.selectItem));
    }; //選擇方式

    const slectDateRange = (did) => {
      trade.allDataLenth = 0;
      dateRange.selectItem = did;
      trade.optionOpen = 0;
      getRecordList(methods.selectItem, getSelectDay(dateRange.selectItem));
    }; //選擇日期

    const getRecordList = async (type, num = 0) => {
      alertService.showLoading();
      let res;
      let today = getDateForamt(new Date()); //今天日期
      let DayAgo = getDateForamt(new Date().getTime() - num * 86400000); //指定天數前日期
      setMethodsText(type);
      if (type === 2) {
        res = await http.get(`/app/history/present-point`, {
          params: {
            start_at: DayAgo + " 00:00:00",
            end_at: (num === 1 ? DayAgo : today) + " 23:59:59", //選項為昨天則結束與開始都是昨天
            limit: 30,
            page: 1,
          },
        });
      } else {
        //若為0則兩者都是今天
        res = await http.get(
          `/app/payment/${type === 0 ? "deposit" : "withdraw"}`,
          {
            params: {
              start_time: DayAgo,
              end_time: num === 1 ? DayAgo : today, //選項為昨天則結束與開始都是昨天
              per_page: 30,
            },
          }
        );
      }
      alertService.close();

      if (res.code !== 1) return;
      let dateInterval = getInterval(today, num); //取得區間日期
      trade.list = type === 2 ? res.data : res.data[0].items;
      trade.list = setData(trade.list, dateInterval); //資料設定
      trade.allDataLenth = trade.list.length;

      function setData(ary, interval) {
        //取得並整理所需資料
        const list = []; //用於存放日期區間
        interval.forEach((day) => {
          let temp = {
            month: day.split("-")[1],
            day: day.split("-")[2],
            list: [],
          }; //每個日期都有一個ary存放相應的資料
          ary.forEach((data) => {
            let setData = {};
            let start = data?.create_at ?? data.completed_at;
            setData.time = start.split(" ").pop(); //建立時間
            setData.date = start.split(" ").shift(); //建立日期
            //狀態給予
            if (methods.selectItem === 2) {
              setData.type = t(
                `pages.trade.detail.form.point_type.${data.type}`
              );
            } else {
              switch (data.status) {
                case "pending":
                  setData.status = t(
                    "pages.trade.detail.form.status.deposit.pending"
                  );
                  break;
                case "audit_pay":
                  setData.status =
                    methods.selectItem === 1
                      ? t("pages.trade.detail.form.status.withdraw.audit_pay")
                      : t(
                          "pages.trade.detail.form.status.deposit.audit_deposit"
                        );
                  break;
                case "wait_payment":
                  setData.status =
                    methods.selectItem === 1
                      ? t(
                          "pages.trade.detail.form.status.withdraw.wait_payment"
                        )
                      : t(
                          "pages.trade.detail.form.status.deposit.wait_payment"
                        );
                  break;
                case "success":
                  setData.status = t(
                    "pages.trade.detail.form.status.withdraw.success"
                  );
                  break;
                case "fail":
                  setData.status = t(
                    "pages.trade.detail.form.status.withdraw.fail"
                  );
                  break;
              }
              switch (data.payment) {
                case "CVS:FAMILY":
                  setData.payment = t("pages.deposit.channel.CVS:FAMILY");
                  break;
                case "CVS:IBON":
                  setData.payment = t("pages.deposit.channel.CVS:IBON");
                  break;
                case "CVS:OK":
                  setData.payment = t("pages.deposit.channel.CVS:OK");
                  break;
                case "CVS:HILIFE":
                  setData.payment = t("pages.deposit.channel.CVS:HILIFE");
                  break;
                case "CVS":
                  setData.payment = t("pages.deposit.channel.CVS");
                  break;
                case "ATM":
                  setData.payment = t("pages.deposit.channel.type.ATM");
                  break;
                case "BANKCARD":
                  setData.payment = t("pages.deposit.channel.BANKCARD");
                  break;
              }
            }
            data.setData = setData;
            if (day === setData.date) temp.list.push(data); //匹配對應日期後push
          });
          if (temp.list.length !== 0) list.push(temp);
        });
        return list;
      }
    }; // 取得歷史列表

    const checkDetailed = (obj) => {
      trade.showDetailed = true;
      switch (methods.selectItem) {
        case 0:
          trade.topupData = obj;
          break;
        case 1:
          trade.withdrawData = obj;
          break;
        case 2:
          trade.pointData = obj;
          break;
      }
    };

    const copyText = (text) => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
        alertService.toast(t("feedback.copy.success"));
      }
    };
    // let temp = [
    //   {
    //     type: "vip_monthly",
    //     before_amount: "81.005",
    //     after_amount: "81.005",
    //     amount: "0.000",
    //     created_at: "2022-06-01 00:00:00",
    //     completed_at: "2022-06-17 14:57:58",
    //   },
    // ];
    onMounted(() => {
      setTitle();
      selectMethods(0);
      document.querySelector(".layout-trade").style.overflow = "hidden";
      document.querySelector(".container__trade").style.overflow = "hidden";
    });

    return {
      trade,
      methods,
      dateRange,
      locale,
      t,
      showOption,
      selectMethods,
      slectDateRange,
      copyText,
      checkDetailed,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/scss/betting.scss";
</style>
