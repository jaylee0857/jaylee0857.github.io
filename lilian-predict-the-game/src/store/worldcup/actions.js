import axios from "@/axios";
const actions = {
  // 跑馬燈
  async "api/sms"(_, phone) {
    const res = await axios.post("/api/sms", {
      phone: phone,
    });
    console.log(res);
    return res.data || [];
  },
  async "api/set-data"(_, payload) {
    const res = await axios.post("/api/set-data", {
      phone: payload.phone,
      captcha: payload.captcha,
      note: payload.note,
    });
    console.log(res);
    return res.data || [];
  },
  async "api/reset"() {
    const res = await axios.post("/api/reset", {
      phone: "886978299199",
      key: "dXaX6vcRcZMVQDSVd5uepe6cO5wlfMnpUfFhRS2b",
    });
    console.log(res);
    return res.data || [];
  },
};

export default actions;
