const mutations = {
  //! @deprecated
  // 跑馬燈設定
  "set/marquee"(state, payload) {
    state.marquee = payload;
  },

  //! @deprecated
  //活動
  "set/news"(state, payload) {
    state.news = payload;
  },

  //! @deprecated
  //通知
  "set/notify"(state, payload) {
    state.notify = payload;
  },
  //限時活動
  "set/limit_news/cycle"(state, payload) {
    state.limit_news.cycle = payload;
  },
  "set/limit_news/home"(state, payload) {
    state.limit_news.home = payload;
  },

  "set/gameUrl"(state, payload) {
    state.gameUrl = payload;
  },
  "set/game"(state, payload) {
    state.game = payload;
  },
  "set/recommendIndex"(state, payload) {
    state.recommendIndex = payload;
  },
  "set/pagesData"(state, payload) {
    state.pagesData = payload;
  },

  "set/modal/running"(state) {
    state.isShowModal = true;
  },
  "set/article"(state, payload) {
    state.article = payload;
  },
  "set/report"(state, payload) {
    state.report = payload;
  },
  "set/reportType"(state, payload) {
    state.reportType = payload;
  },
  "set/playFreq"(state, payload) {
    state.playFreq = payload;
  },
  "set/serviceUrl"(state, payload) {
    state.serviceUrl = payload;
  },
  "set/env"(state, payload) {
    state.env = payload;
  },
  "set/recordFrom"(state, payload) {
    state.recordFrom = payload;
  },
  /** notify */
  "set/notify/withdraw"(state, payload) {
    state.notifys.withdraw = payload;
  },
  "set/notify/vip"(state, payload) {
    state.notifys.vip = payload;
  },
  "set/notify/losed"(state, payload) {
    state.notifys.losed = payload;
  },
  // "remove/notify/tip"(state, payload) {
  //   state.tips = state.tips.filter((item) => item.type !== payload);
  // },
  // "set/notify/tip"(state, payload) {
  //   state.tips.push(payload);
  // },
  // "clear/notify/tip"(state) {
  //   state.tips = [];
  // },
  // "clear/designate/notify/tip"(state, payload) {
  //   const { type, msg } = payload;
  //   const filters = state.tips.filter(
  //     (item) => item.type !== type || item.msg !== msg
  //   );
  //   state.tips = [...filters];
  // },
  "set/download/url"(state, payload) {
    const { apk_url, ipa_url } = payload;
    state.download = {
      apk_url,
      ipa_url,
    };
  },
};

export default mutations;
