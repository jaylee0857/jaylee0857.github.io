/* https://www.kancloud.cn/yunye/axios/234845 */
import axios from "axios";
// import connect from "@/interceptors/connect";
const instance = axios.create();

/* API_URL */
instance.defaults.baseURL = "https://gws-api.vietvipro.com";

/* 狀態碼錯誤範圍 */
instance.defaults.validateStatus = (status) => {
  return status >= 200 && status < 300; // 默認設定
};

export default instance;
