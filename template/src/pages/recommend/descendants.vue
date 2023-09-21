<template>
  <div class="page__record">
    <div class="headers flex items-center" :class="{ ph: locale === 'ph' }">
      <div class="label" v-for="item in labelList" :key="item">
        {{ item }}
      </div>
    </div>
    <div class="main btm">
      <ul class="ulList">
        <li v-show="form.list.length === 0" style="padding: 0 0.1rem">
          <div class="items">{{ t("pages.promote.descendants.empty") }}</div>
        </li>
        <li
          v-for="item in form.list"
          :key="item"
          v-show="form.list.length !== 0"
        >
          <div>{{ setDateFormat(item.ended_at) }}</div>
          <div>{{ item.detail.account }}</div>
          <div>
            {{ item.detail.based_on === 1 ? setAmount(item.detail.amount) : 0 }}
          </div>
          <div>
            {{ item.detail.based_on === 2 ? setAmount(item.detail.amount) : 0 }}
          </div>
          <div>{{ item.amount }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive } from "vue";
import { useI18nService } from "@/services/i18n-service";
import { useHttpService } from "@/services/http-service";
import { useAlertService } from "@/services/alert-service";
import { getDateForamt } from "@/date";

export default {
  layout: "layout-trade",

  setup() {
    const http = useHttpService();
    const alertService = useAlertService();
    const { t, locale } = useI18nService();
    // const store = useStore();
    const form = reactive({
      date: [
        { text: t("pages.promote.descendants.selection.today") },
        { text: t("pages.promote.descendants.selection.yesterday") },
        {
          text: t("pages.promote.descendants.selection.latest.days", {
            days: "7",
          }),
        },
        {
          text: t("pages.promote.descendants.selection.latest.days", {
            days: "30",
          }),
        },
      ],
      selectDate: "",
      list: [],
      isOpen: false,
    });

    const labelList = [
      t("pages.promote.descendants.table.head.dateline"),
      t("pages.promote.descendants.table.head.account"),
      t("pages.promote.descendants.table.head.deposit"),
      t("pages.promote.descendants.table.head.bet"),
      t("pages.promote.descendants.table.head.amount"),
    ];

    const onSelect = (i) => {
      //切換日期
      let yesterday;
      form.date.forEach((data, index) => {
        data.isActive = false;
        if (index == i) {
          data.isActive = true;
          form.selectDate = data.text;
          switch (i) {
            case 0: //今日
              getList(false);
              break;
            case 1: //昨日
              yesterday = getDateForamt(new Date().getTime() - 1 * 86400000);
              getList(false, yesterday);
              break;
            case 2: //近7日
              getList(false, false, 6);
              break;
            case 3: //近30日
              getList(false, false, 29);
              break;
          }
        }
      });
    };

    const setTitle = () => {
      document.querySelector(".title").textContent = t(
        "pages.promote.commission.descendants"
      );
    }; //設定標題

    const setWidth = () => {
      let dom = document.querySelector(".container__trade");
      document.querySelector(".ulList").style.width = dom.scrollWidth + "px";
    };

    // let temp = [
    //   {
    //     id: 382,
    //     user_id: 393,
    //     status: 1,
    //     amount: "0.360",
    //     notes: null,
    //     detail: {
    //       based_on: 2,
    //       amount: "12.000000",
    //       account: "antuatdanh501",
    //       nickname: null,
    //     },
    //     started_at: "2022-06-11 00:00:00",
    //     ended_at: "2022-06-21 23:59:59",
    //     received_at: null,
    //     promotion: {
    //       id: 134,
    //       name: "H5洗碼twst",
    //       type: "mia",
    //       status: 1,
    //       based_on: 2,
    //       notes: null,
    //       started_at: "2022-06-06 00:00:00",
    //       ended_at: "2022-06-30 00:00:00",
    //     },
    //   },
    //   {
    //     id: 384,
    //     user_id: 393,
    //     status: 1,
    //     amount: "0.400",
    //     notes: null,
    //     detail: {
    //       based_on: 2,
    //       amount: "8.000000",
    //       account: "antuatdanh5",
    //       nickname: null,
    //     },
    //     started_at: "2022-06-11 00:00:00",
    //     ended_at: "2022-06-21 23:59:59",
    //     received_at: null,
    //     promotion: {
    //       id: 134,
    //       name: "H5洗碼twst",
    //       type: "mia",
    //       status: 1,
    //       based_on: 2,
    //       notes: null,
    //       started_at: "2022-06-06 00:00:00",
    //       ended_at: "2022-06-30 00:00:00",
    //     },
    //   },
    // ];

    const getList = async (eventid = false) => {
      alertService.showLoading();
      //依照傳入的id進行活動的載入 num則為往後天數
      let id = eventid ? eventid : null;
      let res = await http.get("/app/promotion-records", {
        params: {
          promotion_id: id,
          latest_id: "",
          per_page: 15,
          state: 1,
        },
      });
      alertService.close();
      form.isOpen = false;
      if (res.code !== 1)
        return alertService.alert({
          title: t("app.dialog.system.title2"),
          text: t("pages.bank.modify.empty"),
        });
      form.list = res.data.filter((data) => data.detail);
    };

    const setDateFormat = (date) => {
      let time = date.split(" ");
      time = time[0].split("-");
      return `${time[1]}-${time[2]}`;
    };

    const setAmount = (amount) => {
      return Number.parseFloat(amount).toFixed(2);
    };

    // const sortData = (ary, startDay, dayAgo) => {
    //   //依照日期進行排序
    //   let list = [];
    //   let interval = getInterval(startDay, dayAgo); //取得日期區間 startDay為開始天數，DayAgo為往前推的天數 例如1就是往前推一天
    //   interval.forEach((day) => {
    //     let temp = {
    //       date: day,
    //       list: [],
    //     };
    //     ary.forEach((data) => {
    //       let date = data.started_at.split(" ").shift();
    //       console.log(date == day);
    //       if (date === day) {
    //         temp.list.push(data);
    //       }
    //     });
    //     if (temp.list.length !== 0) {
    //       list.push(temp);
    //     }
    //   });
    //   return list;
    // };

    onMounted(() => {
      setTitle();
      onSelect(0);
      setWidth();
      // 待實際資料
    });
    return {
      t,
      onSelect,
      setAmount,
      setDateFormat,
      form,
      locale,
      labelList,
    };
  },
};
</script>
<style lang="sass" scoped>
@import "@/assets/scss/recommend.scss"
</style>
