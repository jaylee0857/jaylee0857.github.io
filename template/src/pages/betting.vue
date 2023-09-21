<template>
  <div class="betting h-full flex flex-col text-26" v-show="!detail.isShow">
    <section class="flex-none">
      <div
        class="inline-block"
        :class="{ active: betting.optionOpen === 1 }"
        @click="showOption(1)"
      >
        <p v-if="platforms.data.length > 0">
          {{ platforms.data[platforms.isSelect].game_lang }}
        </p>
        <span>▴</span>
      </div>
      <div
        class="inline-block"
        :class="{ active: betting.optionOpen === 2 }"
        @click="showOption(2)"
      >
        <p>{{ dateRange.data[dateRange.isSelect].rangeName }}</p>
        <span>▴</span>
      </div>
    </section>
    <div
      class="content flex-1 relative overflow-hidden"
      :class="{
        'overflow-y-auto': betting.optionOpen === 0,
        empty: betting.allDataLenth === 0,
      }"
      :data-text="t('pages.betting.empty')"
    >
      <div
        class="options fixed w-full h-full"
        v-show="betting.optionOpen !== 0"
        :class="{
          noBorder: betting.optionOpen === 2,
          hide: betting.optionReady === 0,
        }"
      >
        <div
          class="options-list flex h-full flex-col"
          v-show="betting.optionOpen === 1"
        >
          <div class="list platformOptions flex flex-wrap">
            <a
              href="javascript:void(0)"
              v-for="(item, index) in platforms.data"
              :key="index"
              :class="{
                active: item.isSelect === index,
              }"
              @click="slectPlatform(index)"
              ><span>{{ item.game_lang }}</span></a
            >
          </div>
          <div class="flex-1 mask" @click="showOption(1)"></div>
        </div>
        <div
          class="options-list flex h-full flex-col"
          v-show="betting.optionOpen === 2"
        >
          <div class="tip">
            {{ t("pages.betting.selection.range.placeholder") }}
          </div>
          <div class="list flex">
            <a
              href="javascript:void(0)"
              v-for="(item, index) in dateRange.data"
              :key="index"
              :class="{
                active: dateRange.isSelect === index,
                noHeight:
                  index === 2 &&
                  (betting.lang === 'vn' ||
                    betting.lang === 'en' ||
                    betting.lang === 'ph'),
              }"
              @click="slectDateRange(index)"
              >{{ item.rangeName }}</a
            >
          </div>
          <div class="flex-1 mask" @click="showOption(2)"></div>
        </div>
      </div>
      <div class="flex py-4" v-show="betting.allDataLenth !== 0">
        <div class="flex-1 text-left">
          {{ t("pages.betting.data.total", { total: betting.allDataLenth }) }}
        </div>
        <div class="flex-1 text-right">
          {{ t("pages.betting.data.amount")
          }}{{ betting.bet_result.toFixed(2) }}
          <span
            :class="{
              red: betting.bet_total_result > 0,
            }"
          ></span>
        </div>
      </div>
      <div class="relative">
        <template v-for="(item, index) in betting.data" :key="index">
          <div class="flex items-end py-3">
            <div class="w-[20%] text-left text-36 font-semibold text-black">
              {{ index }}
            </div>
            <div class="w-[80%] text-right">
              <span class="mr-5">{{
                t("pages.betting.data.total", {
                  total: betting.data[index]["list"].length,
                })
              }}</span>
              <span
                :class="{
                  red: item.bet_result_day > 0,
                }"
                >{{ t("pages.betting.data.amount")
                }}{{ item.bet_result_day.toFixed(2) }}</span
              >
            </div>
          </div>
          <div class="list">
            <ul>
              <li v-for="(item2, index2) in item.list" :key="index2">
                <div class="platform">{{ item2.platform_lang }}</div>
                <div class="info">
                  <div class="category">{{ item2.game_lang }}</div>
                  <div class="bet_activity">{{ item2.bet_type }}</div>
                  <div class="bet_result">
                    {{ t("pages.betting.bet.amount") }}
                    <span
                      :class="{
                        red: item2.bet_result > 0,
                      }"
                      >{{ item2.bet_result }}</span
                    >
                  </div>
                </div>
                <div class="bet_time">
                  <span>
                    {{ t("pages.betting.bet.time", { time: item2.bet_time }) }}
                  </span>
                  <span
                    class="bet_btn"
                    v-show="item2.btn"
                    @click="showDetail(item2)"
                  >
                    {{ t("pages.betting.bet.detail.button") }}
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </template>
      </div>
    </div>
  </div>
  <div class="detailed layout-trade" v-show="detail.isShow">
    <div class="header">
      <div
        class="go__back"
        id="test"
        @click.prevent="detail.isShow = false"
      ></div>
      <div class="title">{{ t("pages.betting.bet.detail.button") }}</div>
      <div class="go__back" style="visibility: hidden"></div>
    </div>
    <div class="container__trade" id="detailId"></div>
  </div>
</template>
<script>
import { reactive, onMounted, onUpdated, ref } from "vue";
import { useI18nService } from "@/services/i18n-service";
import { useHttpService } from "@/services/http-service";
import { useAlertService } from "@/services/alert-service";
import { useStore } from "vuex";
import { useNotifyStore } from "@/store/notify-store";

export default {
  layout: "layout-trade",
  setup() {
    const http = useHttpService();
    const alertService = useAlertService();
    const notifyStore = useNotifyStore();
    const store = useStore();
    const { t, locale } = useI18nService();
    const dateRange = reactive({
      isSelect: 0,
      data: [
        { rangeName: t("pages.betting.selection.range.today") },
        {
          rangeName: t("pages.betting.selection.range.yesterday"),
        },
        { rangeName: t("pages.betting.selection.range.latest") },
      ],
    });
    const platforms = reactive({
      isSelect: 0,
      data: [],
    }); //平台資料
    const betting = reactive({
      optionReady: 0,
      optionOpen: 1,
      bet_result: 0,
      last_page: 0,
      page: 1,
      loadPage: false,
      limit: 15,
      allDataLenth: 0,
      bet_total_result: 0,
      bet_count: 0,
      data: {},
      lang: locale.value,
    }); //投注明細資料
    const detail = reactive({
      isShow: false,
      html: "",
    });
    const filterDateRange = {};
    const isReady = ref(false);
    const setTitle = () => {
      document.querySelector(".title").textContent = t("app.page.betting");
    }; //設定標題
    const showOption = (type) => {
      if (!isReady.value) return;
      betting.optionOpen = type === betting.optionOpen ? 0 : type;
    }; //顯示過濾選項
    const slectPlatform = (pid) => {
      betting.allDataLenth = betting.bet_result = 0;
      betting.data = {}; //重置數據
      platforms.isSelect = pid;
      betting.optionOpen = 0;
      betRecordList();
    };
    const slectDateRange = (did) => {
      betting.allDataLenth = betting.bet_result = 0;
      betting.data = {}; //重置數據
      dateRange.isSelect = did;
      betting.optionOpen = 0;
      betRecordList();
    };
    const resizeToFfit = (item, outter) => {
      if (item.clientWidth >= outter.clientWidth) {
        item.style.transform =
          "translate(-50%,-50%) scale(" +
          outter.clientWidth / (item.clientWidth + 20) +
          ")";
      }
    }; //計算文字scale
    const setOptionSize = () => {
      const platformOptions = document.querySelectorAll(".platformOptions a");
      platformOptions.forEach((item) => {
        const inner = item.querySelector("span");
        resizeToFfit(inner, item);
      });
      betting.optionOpen = 0;
      betting.optionReady = 2;
    }; //設定選項文字大小
    const triggerPages = () => {
      const content = document.querySelector(".betting >.content");
      let offset = content.scrollHeight - content.scrollTop;
      let height = content.offsetHeight;
      if (offset <= height) {
        betting.page++;
        betRecordList();
      }
    }; //偵測content滾到底部
    const switchScrollListener = () => {
      const content = document.querySelector(".betting >.content");
      if (!betting.loadPage) {
        content.addEventListener("scroll", triggerPages);
        betting.loadPage = true;
      } else {
        content.removeEventListener("scroll", triggerPages);
        betting.loadPage = false;
      }
    };

    const getGameList = () => {
      http
        .get("/app/games", {
          params: {
            lang: locale.value,
          },
          novalidate: false,
          noredirect: false,
        })
        .then((res) => {
          if (res.code === 1) {
            platforms.data = res.data;
            platforms.data.sort(function (a, b) {
              return a.sort !== "0" && a.sort - b.sort;
            });
            let selectAll = {
              platform: "",
              platform_lang: "",
              category: "",
              game: "",
              game_lang: t("pages.betting.selection.game.all"),
              img: "",
              sort: "-1",
              status: "",
            };
            platforms.data.unshift(selectAll);
            betting.optionReady = 1;
            // console.log(platforms.data);
          } else {
            alertService.alert({
              title: t("app.dialog.system.title2"),
              text: t("feedback.read.failed"),
            });
          }
          isReady.value = true;
        });
    }; // 取得遊戲列表
    const betRecordList = () => {
      const nowSelect = platforms.data[platforms.isSelect];
      let paramsArray =
        platforms.isSelect === 0
          ? {
              params: {
                start_at: filterDateRange.start[dateRange.isSelect],
                end_at: filterDateRange.end[dateRange.isSelect],
                time: "01",
                page: betting.page,
                limit: betting.limit,
              },
            }
          : {
              params: {
                start_at: filterDateRange.start[dateRange.isSelect],
                end_at: filterDateRange.end[dateRange.isSelect],
                time: "01",
                page: betting.page,
                platform: nowSelect.platform,
                game: nowSelect.game,
                limit: betting.limit,
              },
            };
      http.get("/app/history/bet-record", paramsArray).then((res) => {
        if (res.code === 1) {
          // console.log(res.meta);
          betting.bet_total_result = res.meta.statistics.total.bet_result;
          betting.bet_count = res.meta.statistics.total.bet_count;
          console.log(betting.bet_total_result, "金額");
          reBuildData(res);
        } else {
          alertService.alert({
            title: t("app.dialog.system.title2"),
            text: t("feedback.read.failed"),
          });
        }
      });
    }; // 取得投注明細列表
    const creatDateRange = () => {
      filterDateRange.start = [
        getNextDate(0),
        getNextDate(-1),
        getNextDate(-6),
      ];
      filterDateRange.end = [
        getNextDate(0, 1),
        getNextDate(-1, 1),
        getNextDate(0, 1),
      ];
      betRecordList();
    }; //產生日期區間
    const getNextDate = (day, end) => {
      let time = end ? "23:59:59" : "00:00:00";
      var dd = new Date();
      dd.setDate(dd.getDate() + day);
      var y = dd.getFullYear();
      var m =
        dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1;
      var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();
      return y + "-" + m + "-" + d + " " + time;
    }; //取得日期格式
    const cDate = (date) => {
      date = new Date(date.replace(/-/g, "/"));
      console.log(date.getMonth() + 1, "date");
      let month =
        date.getMonth() + 1 > 10
          ? date.getMonth() + 1
          : "0" + (date.getMonth() + 1);
      return t("pages.betting.bet.date", { M: month, d: date.getDate() });
    }; //產生月日標題
    const reBuildData = (res) => {
      betting.allDataLenth += res.data.length;
      res.data.forEach((item) => {
        let tempDate = cDate(item.bet_time);
        if (!betting.data[tempDate]) {
          betting.data[tempDate] = {
            bet_result_day: 0,
            list: [],
          };
        }
        betting.data[tempDate].bet_result_day += parseFloat(item.bet_result);
        betting.bet_result += parseFloat(item.bet_result);
        betting.data[tempDate].list.push({
          platform_lang: item.platform_lang,
          game_lang: item.game_lang,
          platform: item.platform,
          game: item.game,
          bet_type: item.bet_type,
          bet_result: item.bet_result,
          bet_time: item.bet_time,
          btn: item.platform === "pb",
          bet_sn: item.bet_sn,
        });
      });
      if (res.meta.page === 1 && res.meta.last_page !== 1) {
        !betting.loadPage && switchScrollListener(); //監聽loadmore
      }
      if (res.meta.page > 1 && res.meta.page == res.meta.last_page) {
        betting.loadPage && switchScrollListener(); //移除監聽loadmore
      }
    }; //重新整理資料

    const showDetail = async (item) => {
      console.log(item);
      detail.isShow = true;
      let res = await store.dispatch("app/get/betDetail", {
        platform: item.platform,
        bet_sn: item.bet_sn,
        lang: locale.value,
      });
      if (res.code !== 1)
        return alertService.alert({
          title: t("app.dialog.system.title2"),
          text: t("feedback.read.failed"),
        });
      document.querySelector("#detailId").innerHTML = res.data[0].html_txt;
      document.querySelector("#detailId").style["font-size"] = ".3rem";
      document.querySelector("#detailId").style["padding"] = ".2rem";
    };
    onMounted(() => {
      creatDateRange();
      getGameList();
      setTitle();
      notifyStore.readNotify({ type: "bet_record" });
    });
    onUpdated(() => {
      betting.optionReady === 1 && setOptionSize();
    });
    return {
      t,
      locale,
      showOption,
      betting,
      detail,
      platforms,
      dateRange,
      slectPlatform,
      slectDateRange,
      showDetail,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/scss/betting.scss";
.container__trade {
  font-size: 0.3rem;
}
.noHeight {
  line-height: 0.35rem !important;
}
</style>
