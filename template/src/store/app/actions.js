import { useHttpService } from "@/services/http-service";
import { useAuthStore } from "../auth-store";
import { useNotifyStore } from "../notify-store";
import { useAuthWorkflow } from "@/workflows/auth-workflow";

const actions = {
  //! @deprecated
  // 跑馬燈
  async "read/marquee"() {
    const http = useHttpService();
    const res = await http.get("/app/user/news", {
      params: { type: 1 },
      novalidate: true,
      noredirect: true,
    });
    const withdrawRes = await http.get("/app/withdraw", {
      novalidate: true,
      noredirect: true,
    });
    return {
      marquee: res.data,
      withdraw: withdrawRes.data,
    };
  },

  //! @deprecated
  // 遊戲列表
  async "read/game/list"(_, payload) {
    const http = useHttpService();
    const res = await http.get("/app/games", {
      params: {
        type: payload.type,
        lang: payload.lang,
      },
      novalidate: false,
      noredirect: false,
    });

    return res.code === 1 ? res.data : [];
  },

  //! @deprecated
  async "read/banner"() {
    const http = useHttpService();
    const res = await http.get("/app/banners", {
      params: {
        device: "mobile",
      },
      novalidate: true,
      noredirect: true,
    });
    return res;
  },

  // vip升級資訊
  async "read/vip"() {
    const http = useHttpService();
    const res = await http.get("/app/vip");
    return res;
  },

  //! @deprecated
  // banner的排名 / 我的 的vip倒數 / 優惠的vip升級資訊
  async "read/rank"() {
    const http = useHttpService();
    const res = await http.get("/app/vip-upgrade-list");
    return res;
  },

  //! @deprecated
  // 活動
  async "read/news"({ commit }) {
    const http = useHttpService();
    const res = await http.get("/app/user/news", {
      params: { type: 3 },
      novalidate: true,
      noredirect: true,
    });
    commit("set/news", res.data);
  },

  //! @deprecated
  // 通知
  async "read/notify"({ commit }) {
    const http = useHttpService();
    let res = await http.get("/app/user/news", {
      params: { type: 2 },
      novalidate: true,
      noredirect: true,
    });
    commit("set/notify", res.data);
  },

  //! @deprecated
  // 限時活動
  async "read/limit_news"({ commit }, isCycle) {
    const http = useHttpService();
    const res = await http.get("/app/user/news", {
      params: { type: 4 },
      novalidate: true,
      noredirect: true,
    });
    if (res.data.length < 0) return;
    const commitType = isCycle ? "set/limit_news/cycle" : "set/limit_news/home";
    commit(commitType, res.data);
  },

  // 全民推廣-個人佣金
  async "read/commissions"() {
    const http = useHttpService();
    const res = await http.get("/app/commissions", {
      params: { status: 1 },
      novalidate: false,
      noredirect: false,
    });
    return res.data;
  },

  "read/recommendIndex"({ commit }, payload) {
    commit("set/recommendIndex", payload);
  },

  //! @deprecated
  async "get/game"({ commit }, payload = {}) {
    const authStore = useAuthStore();
    const authWorkflow = useAuthWorkflow();
    const http = useHttpService();

    //! @deprecated
    if (!payload?.game) {
      const phone = authStore.user.phone;
      if (!authStore.first_addition_notify) {
        authWorkflow.updateNoviceTask({ type: "first_addition_notify" });
        /* 若再進來小紅包時卻無跳彈窗則新手提示也不避顯示了，直接關閉 */
        if (!authStore.first_login_notify) {
          authWorkflow.updateNoviceTask({ type: "first_login_notify" });
        }
      }

      commit("set/gameUrl", `${import.meta.env.VITE_ENV_GAME_URL}?p=${phone}`);
      return 1;
    }

    let res = await http.post(
      "/app/user/lock-credit",
      {
        //先鎖定額度
        lock: 1,
        platform: payload.platform,
        game: payload.game,
      },
      {
        novalidate: false,
        noredirect: false,
      }
    );
    if (res.code !== 1) return res.code;
    res = await http.get("/app/forward", {
      params: {
        platform: payload.platform,
        game: payload.game,
        lang: payload?.lang ?? "tw",
      },
    });
    if (res.code !== 1) return res.code;
    commit("set/gameUrl", res.data.url);
    return res.code;
  },

  //! @deprecated
  // 取款-出款列表
  async "read/withdrawChannels"() {
    const http = useHttpService();
    const res = await http.get("/app/payment/withdraw/channels", {
      novalidate: false,
      noredirect: false,
    });
    return res;
  },

  //! @deprecated
  async "set/unlock"() {
    const http = useHttpService();
    let res = await http.post(
      "/app/user/lock-credit",
      {
        //解鎖額度
        lock: 0,
      },
      {
        novalidate: true,
        noredirect: true,
      }
    );
    if (res.code !== 1) return false;
    return true;
  },

  //! @deprecated
  async "get/playsQuantity"() {
    const authStore = useAuthStore();
    //確認遊玩次數
    const http = useHttpService();
    const res = await http.get("/addition/receive-left", {
      params: {
        phone: authStore.user.phone,
      },
    });
    return res;
  },

  // async "get/withdrawRecode"() {
  //   let res = await http.get("/app/payment/withdraw", {
  //     params: {
  //       start_time: getDateForamt(new Date().getTime() - 30 * 86400000),
  //       end_time: getDateForamt(new Date()), //選項為昨天則結束與開始都是昨天
  //       per_page: 30,
  //     },
  //   });
  //   if (res.code !== 1) return false;
  //   return res;
  // },
  async "get/betDetail"(_, payload) {
    console.log(payload.platform);
    const http = useHttpService();
    let res = await http.get("/app/history/bet-detail", {
      params: {
        platform: payload.platform,
        bet_sn: payload.bet_sn,
        lang: payload.lang,
      },
    });
    return res;
  },
  async "get/report"(_, payload) {
    const http = useHttpService();
    let res = await http.get("/app/income-record", {
      params: payload,
    });
    return res;
  },
  async "get/report/detail"({ commit }, payload) {
    const http = useHttpService();
    let res = await http.get("/app/income-record-detail", {
      params: payload,
    });
    if (res.code !== 1) return false;
    commit("set/report", res.data);
    commit("set/reportType", payload.action);
    return true;
  },
  async "get/permission"(_, payload) {
    const http = useHttpService();
    let res = await http.get("/app/has-permission", {
      params: {
        account: payload,
        permission_name: "promoteview:report",
      },
    });
    return res;
  },
  //! @deprecated
  async "get/downloadUrl"({ commit }) {
    const http = useHttpService();
    let res = await http.get("/app/download-promote-channel");
    if (res.code !== 1) return -1;
    commit("set/download/url", {
      ipa_url: res.data[0]?.ipa_url ?? "",
      apk_url: res.data[0]?.apk_url ?? "",
    });
    return 1;
  },

  //! @deprecated
  async "get/serviceUrl"({ commit }) {
    const http = useHttpService();
    let res = await http.get("/app/dialogue-url", {
      noredirect: true,
      novalidate: true,
    });
    if (res.code !== 1) return false;
    const { zalo_url, line_url } = res.data;
    // console.log(res);
    const viviService = {
      line_url,
      zalo_url,
    };
    commit("set/serviceUrl", viviService);
    return true;
  },

  async "get/deposit/detail"(_, payload) {
    const http = useHttpService();
    let res = await http.get(`/app/payment/deposit/${payload}/payment-info`, {
      novalidate: true,
      noredirect: true,
    });
    return res;
  },

  //! @deprecated
  async "get/withdraw"(_, payload) {
    const http = useHttpService();
    const res = await http.post("/app/payment/withdraw", {
      account_id: payload.bank__id,
      amount: payload.amount,
      note: "",
    });
    return res.code;
  },

  //! @deprecated
  async "set/limitNews"(_, payload) {
    console.log(payload, "payload");
    const http = useHttpService();
    let res = await http.post("/app/user/update-news", {
      id: payload.id, //活動id
      read_lock: payload.read_lock, //是否不再提示 後端不會再回傳
    });
    return res;
  },

  //! @deprecated
  async "get/notify"() {
    const http = useHttpService();
    const res = await http.get("/app/user/notify-update-list", {
      novalidate: true,
      noredirect: true,
    });
    return res;
  },

  //! @deprecated
  async "set/notify"(_, payload) {
    const notifyStore = useNotifyStore();
    const post = {
      type: payload.type,
      msg: `${payload?.msg}`,
    };
    const filters = notifyStore.tips.filter(
      (item) => item.type !== payload.type || item.msg !== `${payload?.msg}`
    );
    notifyStore.tips = [...filters];

    const http = useHttpService();
    const res = await http.post("/app/user/notify-update-list", post);
    return res;
  },
  async "read/discount"() {
    const http = useHttpService();
    const res = await http.get("/app/promotes");
    return res;
  },
  async "apply/discount"(_, payload) {
    const http = useHttpService();
    const res = http.post("/app/promotes/apply", {
      action: payload.discountType,
      promote_id: payload.discountId,
    });
    return res;
  },
  async "read/ranking"(_, payload) {
    const http = useHttpService();
    const res = await http.get("/app/leaderboard", {
      params: {
        week: payload,
        latest_count: 10,
      },
    });
    // res = {
    //   data: [
    //     {
    //       account: "thantaitai",
    //       total_withdraw: "177757.000",
    //       last_deposit: "10000.000",
    //       last_withdraw: "16060.000",
    //     },
    //     {
    //       account: "phuongthuy4193",
    //       total_withdraw: "150000.000",
    //       last_deposit: null,
    //       last_withdraw: "30000.000",
    //     },
    //     {
    //       account: "cutitieutienti",
    //       total_withdraw: "128360.000",
    //       last_deposit: "20000.000",
    //       last_withdraw: "20060.000",
    //     },
    //     {
    //       account: "quangcanh1986",
    //       total_withdraw: "120200.000",
    //       last_deposit: "5000.000",
    //       last_withdraw: "18000.000",
    //     },
    //     {
    //       account: "usausa87",
    //       total_withdraw: "107085.000",
    //       last_deposit: "800.000",
    //       last_withdraw: "17860.000",
    //     },
    //     {
    //       account: "chien6789",
    //       total_withdraw: "93300.000",
    //       last_deposit: "10000.000",
    //       last_withdraw: "13200.000",
    //     },
    //     {
    //       account: "vantruc",
    //       total_withdraw: "86480.000",
    //       last_deposit: "6500.000",
    //       last_withdraw: "33660.000",
    //     },
    //     {
    //       account: "trjeuthajkaka",
    //       total_withdraw: "82007.000",
    //       last_deposit: "1300.000",
    //       last_withdraw: "7000.000",
    //     },
    //     {
    //       account: "nguyenloi721993",
    //       total_withdraw: "80960.000",
    //       last_deposit: "20000.000",
    //       last_withdraw: "23423.000",
    //     },
    //     {
    //       account: "thanhdong85",
    //       total_withdraw: "80000.000",
    //       last_deposit: "10000.000",
    //       last_withdraw: "50000.000",
    //     },
    //   ],
    //   self: {
    //     account: "thantaitai",
    //     total_withdraw: "177757.000",
    //     last_deposit: "10000.000",
    //     last_withdraw: "16060.000",
    //   },
    //   code: 1,
    //   version: "2.5",
    // };
    return res;
  },

  //! @deprecated
  async "read/withdraw/wash-amount-detail"() {
    const http = useHttpService();
    // const res = await http.get("/app/activity/wash-amount/info");
    const res = await http.get("/app/activity/deposit-withdraw/info");
    return res;
  },

  //! @deprecated
  async "set/withdraw/receive"() {
    const http = useHttpService();
    // const res = await http.post("/app/activity/wash-amount/receive");
    const res = await http.post("/app/activity/deposit-withdraw/receive");
    return res;
  },
};

export default actions;
