const state = () => {
  return {
    marquee: [], //跑馬燈
    gameUrl: "",
    game: "",
    news: [],
    notify: [],
    article: {},
    recommendIndex: "",
    pagesData: {
      name: "",
      id: "",
    },
    report: [],
    reportType: "",
    playFreq: 0,
    serviceUrl: {
      chat_url: "",
      kakao_url: "",
      line_url: "",
      service_url: "",
      telegram_url: "",
      zalo_url: "",
    },
    env: "prod",
    /** popup */
    // popupState: {
    //   $display: false,
    //   $timestamp: -1,
    // },
    limit_news: {
      home: {},
      cycle: {},
    },
    isShowModal: false,
    recordFrom: "",
    // notifys: {
    //   withdraw: {},
    //   vip: {},
    //   losed: {},
    // },
    // tips: [],
    download: {
      ipa_url: "",
      apk_url: "",
    },
  };
};
export default state;
