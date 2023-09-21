<template>
  <div class="payment margin-t bg-w">
    <div class="label">
      <span class="required">*</span>
      {{ t("pages.deposit.form.payment") }}
    </div>
    <div class="tag margin-t-sm">
      <div
        class="btn"
        :class="{ disabled: payment.toggle !== 'cvs', vi: locale === 'vi' }"
        @click="
          payment.toggle = 'cvs';
          resetPayment(payment.list);
        "
      >
        <div class="icon cvs"></div>
        {{ t("pages.deposit.channel.type.CVS") }}
      </div>
      <div
        class="btn"
        :class="{ disabled: payment.toggle === 'cvs', vi: locale === 'vi' }"
        @click="
          payment.toggle = 'remits';
          resetPayment(payment.list);
        "
      >
        <div class="icon card"></div>
        {{ t("pages.deposit.channel.type.ATM") }}
      </div>
    </div>
    <ul class="items margin-t">
      <li
        v-for="item in payment.list"
        :key="item.channel_code"
        v-show="item.type === payment.toggle"
        :class="{ active: item.isActive }"
        @click="setPaymentActive(payment.list, item)"
      >
        <div class="icon" :class="item.icon"></div>
        <div
          class="text"
          v-text-fit="{
            minFontSize: 6,
            maxFontSize: 14,
          }"
          v-if="item.type === payment.toggle"
        >
          {{ item.name }}
        </div>
        <div class="active" v-if="item.isActive">
          <div class="tick"></div>
        </div>
      </li>
    </ul>
    <div class="illustrate" @click="forwardIllustrate(payment.toggle)">
      <img
        class="illustrate-icon"
        src="@/assets/images/trade/icon_deposit_instruction_list.png"
        alt=""
      />
      <span class="illustrate-text">
        {{
          t(
            `pages.deposit.illustrate${
              payment.toggle === "cvs" ? "" : ".atm"
            }.title`
          )
        }}
      </span>
    </div>
  </div>
  <div class="margin-t bg-w amount">
    <div class="content">
      <div class="label">
        <span class="required">*</span>
        {{ t("pages.deposit.form.money") }}
      </div>
      <input
        type="number"
        v-model="form.amount"
        :placeholder="t('pages.deposit.form.money.placeholder')"
        class="topup-input"
        @keyup="checkPoint"
      />
    </div>
  </div>
  <div class="margin-t bg-w fastEnter">
    <div class="label">
      <span class="required">*</span>
      {{ t("pages.deposit.form.amount") }}
    </div>
    <ul>
      <li
        v-for="item in amountList"
        :key="item.text"
        @click="count(item.number)"
      >
        <div class="icon"></div>
        {{ item.text }}
      </li>
    </ul>
  </div>
  <div class="illustrate-attention">
    <h2>{{ t("pages.deposit.illustrate.attention") }}</h2>
    <div>
      <p>{{ t("pages.deposit.illustrate.attention.1") }}</p>
      <p>{{ t("pages.deposit.illustrate.attention.2") }}</p>
    </div>
  </div>
  <div class="footer">
    <div class="submit" :class="{ disabled: form.invalid }" @click="onSubmit">
      {{ t("pages.deposit.form.submit") }}
    </div>
    <div class="question margin-t">
      {{ t("pages.deposit.to.service") }}
      <router-link class="link" to="/service">
        {{ t("pages.deposit.to.service.params.0") }}
      </router-link>
      {{ t("pages.deposit.to.service.params.1") }}
    </div>
  </div>
  <div v-if="record.list.length !== 0">
    <div class="record" v-for="(item, index) in record.list" :key="index">
      <div class="date">
        {{ t("pages.deposit.history", { M: item.month, d: item.day }) }}
      </div>
      <ul>
        <li v-for="data in item.list" :key="data.sn">
          <div class="icon"></div>
          <div class="content">
            <div class="state">
              <p class="method">{{ t("app.menu.deposit") }}</p>
              <p class="time">{{ data.setData.time }}</p>
            </div>
            <div class="sum">{{ data.points }}</div>
            <div class="actions">
              <div
                class="btn"
                @click="showRecord(data.setData.origin.options)"
                :id="data.sn"
              >
                {{ t("pages.trade.detail.form.info") }}
              </div>
              <img
                @click="forwardIllustrate(data.payment)"
                class="illustrate-icon"
                src="@/assets/images/trade/icon_deposit_instruction_list.png"
                alt=""
              />
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { reactive, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth-store";
import { usePopupStore } from "@/store/popup-store";
import { useNotifyStore } from "@/store/notify-store";
import { useI18nService } from "@/services/i18n-service";
import { useHttpService } from "@/services/http-service";
import { useAlertService } from "@/services/alert-service";

/** components */
import IllustrateRemits from "@/widgets/popup/topup/illustrate-remits.vue";
import IllustrateCvs from "@/widgets/popup/topup/illustrate-cvs.vue";

/** helper */
import { isEmpty } from "ramda";
import { failprev } from "@/tool";

export default {
  layout: "layout-trade",
  title: "app.menu.deposit",
  setup() {
    const authStore = useAuthStore();
    const popupStore = usePopupStore();
    const notifyStore = useNotifyStore();
    const http = useHttpService();
    const alertService = useAlertService();
    const { t, locale } = useI18nService();
    const router = useRouter();
    const store = useStore();
    const amountList = [
      {
        text: "300",
        number: 300,
      },
      {
        text: "500",
        number: 500,
      },
      {
        text: "1,000",
        number: 1000,
      },
      {
        text: "3,000",
        number: 3000,
      },
      {
        text: "5,000",
        number: 5000,
      },
      {
        text: "10,000",
        number: 10000,
      },
      {
        text: "15,000",
        number: 15000,
      },
      {
        text: "20,000",
        number: 20000,
      },
    ]; // 快速輸入金額列表
    const payment = reactive({ list: [] }); //用於付款列表
    const record = reactive({ list: [] });
    const form = reactive({
      invalid: computed(
        () => form.payment === "" || form.amount === "" || form.phone
      ), //這邊的原理是如果其中兩者為空則回傳true
      amount: "",
      payment: "",
      max: 0,
      min: 0,
      realName: computed(() => isEmpty(authStore.user.realname ?? "")),
      phone: computed(() => isEmpty(authStore.user.phone ?? "")),
    });

    const getPayment = async () => {
      const res = await http.get("/app/payment/deposit/channels");
      if (res.code !== 1 || res?.data?.length === 0) return failprev();
      payment.list = res.data;
      payment.toggle = "cvs";
      setPayment(payment.list);
    }; // 取得付款列表

    const setPayment = (ary) => {
      ary.forEach((data) => {
        data.isActive = false; //給予點選狀態旗標
        switch (
          data.channel_code //利用通道代碼進行判斷給予icon
        ) {
          case "ATM": //不限制銀行轉帳
            data.icon = "remit";
            data.type = "remits";
            data.name = t("pages.deposit.channel.type.ATM");
            break;
          case "BANKCARD": //銀行卡
            data.icon = "remit";
            data.type = "remits";
            data.name = t("pages.deposit.channel.BANKCARD");
            break;
          case "CVS:IBON": //7-11
            data.icon = "seven";
            data.type = "cvs";
            data.name = t("pages.deposit.channel.CVS:IBON");
            break;
          case "CVS:FAMILY": //全家
            data.icon = "family";
            data.type = "cvs";
            data.name = t("pages.deposit.channel.CVS:FAMILY");
            break;
          case "CVS:OK": //OK超商
            data.icon = "ok";
            data.type = "cvs";
            data.name = t("pages.deposit.channel.CVS:OK");
            break;
          case "CVS:HILIFE": //萊爾富
            data.icon = "hilife";
            data.type = "cvs";
            data.name = t("pages.deposit.channel.CVS:HILIFE");
            break;
          case "CVS": //超商代碼
            data.icon = "total";
            data.type = "cvs";
            data.name = t("pages.deposit.channel.CVS");
            break;
          case "GCASH_BANK": //GCASH_BANK
            data.icon = "total";
            data.type = "remits";
            data.name = t("pages.deposit.channel.GCASH_BANK");
            break;
          case "GCASH_QR": //超商代碼
            data.icon = "total";
            data.type = "remits";
            data.name = t("pages.deposit.channel.GCASH_QR");
            break;
          case "GCASH_CARD": //Gcash儲值卡
            data.icon = "total";
            data.type = "remits";
            data.name = t("pages.deposit.channel.GCASH_CARD");
            break;
        }
        /* 加入金額限制 */
        data.max = data.ceiling;
        data.min = data.floor;
        // if (data.channel_code === "BANKCARD") data.max = "20000";
      });
    }; //給予付款列表狀態旗標

    const getRecode = async (num = 1) => {
      let today = getDateForamt(new Date()); //今天日期
      let DayAgo = getDateForamt(new Date().getTime() - num * 86400000); //指定天數前日期
      let res = await http.get("/app/payment/deposit", {
        params: {
          start_time: DayAgo,
          end_time: today,
          per_page: 30,
        },
      });
      if (res.code !== 1) return;
      let dateInterval = getInterval(today, num); //取得區間日期

      record.list = res.data[0].items;
      record.list = setData(record.list, dateInterval); //資料設定

      function setData(ary, interval) {
        const list = []; //用於存放日期區間

        const getCVSText = (type, code) =>
          `${t(
            `pages.deposit.channel.${type}`
          )} ${t("pages.deposit.describe.CVS", { code })}`;

        interval.forEach((day) => {
          const [month, dayOfMonth] = day.split("-");
          const temp = {
            month,
            day: dayOfMonth,
            list: [],
          }; //每個日期都有一個ary存放相應的資料

          ary.forEach((data, index) => {
            const [date, time] = data.create_at.split(" ");
            const setData = {
              time,
              date,
              origin: data,
            };

            if (data.options === null) {
              ary.splice(index, 1);
              return;
            }

            const payment = data.payment;
            if (payment === "CVS:FAMILY") {
              setData.title = t("pages.deposit.channel.type.CVS");
              setData.text = getCVSText("CVS:FAMILY", data.options?.cvs_code);
            } else if (payment === "ATM") {
              setData.title = t("pages.deposit.channel.type.ATM");
              setData.text = t("pages.deposit.describe.ATM", {
                code: data.options?.bank_code,
                acc: data.options?.bank_account,
              });
            } else if (
              ["CVS:IBON", "CVS", "CVS:OK", "CVS:HILIFE"].includes(payment)
            ) {
              setData.title = t("pages.deposit.channel.type.CVS");
              setData.text = getCVSText(payment, data.options?.cvs_code);
            }

            data.setData = setData;

            if (day === setData.date && data.options) {
              temp.list.push(data);
            }
          });

          if (temp.list.length !== 0) {
            list.push(temp);
          }
        });

        return list;
      }
      //取得並整理所需資料
    }; //取得存款紀錄

    const setPaymentActive = (ary, item) => {
      ary.forEach((data) => {
        data.isActive = false; //reset all
        if (data.channel_code === item.channel_code) {
          data.isActive = true;
          form.payment = item.channel_code; // 設定付款方式
          form.max = item.max;
          form.min = item.min;
        }
      });
    }; //選擇付款方式

    const resetPayment = (ary) => {
      form.payment = "";
      ary.forEach((data) => (data.isActive = false));
    }; //清空付款方式

    const count = (num) => {
      if (form.amount === "") {
        form.amount = 0;
      } //若變數為空值非0則給予0以使其能計算
      form.amount = parseInt(form.amount); //強行扣除小數點並轉換數字型別
      form.amount += num;
    }; //快速輸入金額

    const checkPoint = () => {
      if (typeof form.amount !== "number") return (form.amount = "");
      form.amount = parseInt(form.amount);
    }; //將小數點捨棄

    const showRecord = async (item) => {
      const cvsType =
        item?.cvs_store === "CVS" ? "CVS" : `CVS:${item?.cvs_store}`;
      const haveCode = item.bank_code !== "" || item.bank_name !== null;
      let type = "atm";
      let isAlert = true;
      let title = "",
        text = "";
      if (item?.cvs_code) {
        title = t("pages.deposit.channel.type.CVS");
        text = `${t(`pages.deposit.channel.${cvsType}`)}
            ${t("pages.deposit.describe.CVS", {
              code: item.cvs_code,
            })}`;
        type = "cvs";
      } else if (item.bank_code !== "") {
        console.log(item.bank_code, "執行");
        title = t("pages.deposit.channel.type.ATM");
        text = `${t("pages.deposit.describe.ATM", {
          code: item.bank_code,
          name: item.bank_name,
          acc: item.bank_account,
        })}`;
      } else if (item.bank_name) {
        title = t("pages.deposit.channel.BANKCARD");
        text = `${t("pages.deposit.describe.BANKCARD", {
          code: item.bank_name,
          acc: item.bank_account,
        })}`;
      }
      if (isAlert) {
        const { isConfirmed } = await alertService.confirm({
          title,
          text,
          style: haveCode ? "pre" : "",
          cancelButtonText: t(
            `pages.deposit.illustrate${type === "cvs" ? "" : ".atm"}.title`
          ),
          customClass: "cancel-plus",
        });
        if (!isConfirmed) forwardIllustrate(type);
      }
    }; //繳費資料顯示

    const forwardIllustrate = (payment) => {
      const isCvs = payment.toLocaleUpperCase().includes("CVS");
      const component = isCvs ? IllustrateCvs : IllustrateRemits;
      popupStore.paging({
        title: t(
          `pages.deposit.illustrate.paging.title.${isCvs ? "cvs" : "atm"}`
        ),
        component,
        props: {},
      });
    };

    const getOrderDetail = async (id) => {
      const paymentText = form.payment;
      const isCvs = form.payment.includes("CVS");
      // form.payment = "ATM"; //test
      let num = 0;
      let res = {
        code: -2,
      };
      const timer = setInterval(async () => {
        if (num === 60 && res.code !== 1) {
          const fail = [100002, 100003];
          const code = fail.includes(res.code) ? -1 : res.code;
          clearInterval(timer);
          alertService.alert({
            title: t("feedback.action.failed"),
            text: t(`error.code.deposit.payment_info.${code}`),
          });
          return;
        }
        if (res.code === 1) {
          clearInterval(timer);
          let isAlert = true;
          let title = "",
            text = "";
          if (paymentText.includes("CVS")) {
            const cvsType =
              res.data?.cvs_store === "CVS"
                ? "CVS"
                : `CVS:${res.data?.cvs_store}`;
            title = t("pages.deposit.channel.type.CVS");
            text = `${t(`pages.deposit.channel.${cvsType}`)}
            ${t("pages.deposit.describe.CVS", {
              code: res.data.cvs_code,
            })}`;
          }
          if (paymentText.includes("ATM")) {
            title = t("pages.deposit.channel.type.ATM");
            text = `${t("pages.deposit.describe.ATM", {
              code: res.data.bank_code,
              name: res.data.bank_name,
              acc: res.data.bank_account,
            })}`;
            console.log("ATM");
          }
          if (form.payment.indexOf("BANKCARD") !== -1) {
            title = t("pages.deposit.channel.BANKCARD");
            text = `${t("pages.deposit.describe.BANKCARD", {
              code: res.data.bank_name,
              acc: res.data.bank_account,
            })}`;
          }
          if (isAlert) {
            const { isConfirmed } = await alertService.confirm({
              title,
              text,
              style: isCvs ? "" : "pre",
              cancelButtonText: t(
                `pages.deposit.illustrate${
                  paymentText === "cvs" ? "" : ".atm"
                }.title`
              ),
              customClass: "cancel-plus",
            });
            if (!isConfirmed) forwardIllustrate(paymentText);
          }
          setTimeout(() => {
            getRecode();
          }, 5000); //避免過於頻繁的API，故延後秒數刷新存款顯示列表
          return;
        }
        num++;
        // eslint-disable-next-line require-atomic-updates
        res = await store.dispatch("app/get/deposit/detail", id);
      }, 1000);
    };

    const toPay = async () => {
      alertService.showLoading();
      let res = await http.post("/app/payment/deposit", {
        amount: form.amount,
        payment: form.payment,
      });
      if (res.code !== 1)
        return alertService.alert({
          title: t("feedback.action.failed"),
          text: t("error.code.deposit.-1"),
        });
      getOrderDetail(res.data.sn);
    };

    const onSubmit = async () => {
      /** 驗證 */
      if (form.amount > form.max)
        return alertService.alert({
          title: t("feedback.action.failed"),
          text: t("pages.deposit.amountMaximum"),
        });
      if (form.amount < form.min)
        return alertService.alert({
          title: t("feedback.action.failed"),
          text: t("pages.deposit.amountMinimum"),
        });
      if (form.invalid) return;
      toPay(); //付款
    }; //取得支付資訊

    function getDateForamt(second) {
      let day = new Date(second);
      return `${day.getFullYear()}-${addzero(day.getMonth() + 1)}-${addzero(
        day.getDate()
      )}`;
    } //給予日期標準格式 參數丟入毫秒數、日期

    function addzero(num) {
      return num < 10 ? "0" + num : num;
    } //個位數以下給予0

    function getInterval(today, num) {
      const millisecondsPerDay = 86400000;
      const list = [today]; // 加入今天的日期

      for (let i = 1; i <= num; i++) {
        const previousDay = new Date(
          new Date(today).getTime() - i * millisecondsPerDay
        );
        list.push(getDateForamt(previousDay));
      }

      return list;
    }

    const checkPhone = async () => {
      const isAlert = form.phone;
      if (isAlert) {
        await alertService.confirm({
          title: t(`app.dialog.setphone.title`),
          text: t(`app.dialog.setphone.text`),
          confirmCallback: () => {
            router.push("/account/phone");
          },
        });
      }
    };

    onMounted(() => {
      checkPhone();
      getPayment();
      getRecode(2);
      notifyStore.readNotify({ type: "deposit" });
      // eslint-disable-next-line no-constant-condition
    });

    return {
      count,
      onSubmit,
      checkPoint,
      showRecord,
      resetPayment,
      setPaymentActive,
      forwardIllustrate,
      t,
      form,
      amountList,
      payment,
      record,
      locale,
    };
  },
  // beforeRouteEnter(to, from, next) {
  //   if (
  //     to.path === "/topup" &&
  //     from.path === "/home" &&
  //     storage.get("token") === ""
  //   ) {
  //     next({ name: "/login" });
  //     return;
  //   }
  //   next();
  // },
};
</script>
<style lang="scss" scoped>
@import "@/assets/scss/topup.scss";
.checkbox {
  padding: 0 0.25rem;
  font-size: 0.2rem;
}
.topup-input {
  width: 76%;
  &::placeholder {
    font-size: 0.15rem;
  }
}

.ex_text {
  color: #a83d3d;
  font-size: 0.2rem;
}
.ex_icon {
  display: inline-block;
  width: 9px;
  height: 9px;
  background: #a83d3d;
  border-radius: 9999px;
}
</style>
