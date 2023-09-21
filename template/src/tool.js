import { useI18nService } from "@/services/i18n-service";
import { useAlertService } from "@/services/alert-service";
import store from "@/store";
import router from "@/router";
import storage from "store2";

export const getImageUrl = (router) => {
  return new URL(`./assets/images/${router}`, import.meta.url).href;
};

export const openPage = (url) => {
  if (url === "") return; //空字串則return
  let isAndroid = navigator.userAgent.indexOf("Mac") === -1; //判斷裝置 有掃到Mac為 iPhone and iPad
  if (isAndroid) {
    return window.open(url);
  }
  document.location.href = url;
};

export const checkMobile = () => {
  const mobiles = [
    "Android",
    "webOS",
    "iphone",
    "iPad",
    "iPod",
    "BlackBerry",
    "windows Phone",
  ];
  let isMobile = mobiles.some((e) => {
    return navigator.userAgent.indexOf(e) !== -1;
  });
  return isMobile;
}; //用於偵測是否為行動裝置

//! @deprecated
export const toService = () => {
  const i18n = useI18nService();
  const alertService = useAlertService();
  let str = "";
  for (const key in store.state.app.serviceUrl) {
    const value = store.state.app.serviceUrl[key];
    const styleClass = key.split("_")[0]; //取key字串 用於設定icon樣式
    /* url不為空才加入 */
    if (value !== "")
      str += `<a class="service-list-icon ${styleClass}" target="_blank" href="${value}"></a>`;
  }
  alertService.alert({
    title: i18n.t("app.page.service"),
    html: `<div class="service-list">${str}</div>`,
    confirmButtonText: i18n.t("pages.home.welcome.close"),
  });
};

//! @deprecated
export const setLang = (lang, isOrigin) => {
  const haveLangsImage = ["vi", "zh-tw", "en-ph"];
  let setLang = haveLangsImage.includes(lang) ? lang : "zh";
  if (!isOrigin) {
    switch (setLang) {
      case "en-ph":
        setLang = setLang.split("-")[1];
        break;
      case "zh-tw":
        setLang = setLang.split("-")[0];
        break;
    }
  }
  return setLang;
};

export const failprev = (title, text) => {
  const i18n = useI18nService();
  const alertService = useAlertService();
  alertService.alert({
    title: title || i18n.t("app.dialog.system.title"),
    text: text || i18n.t("pages.trade.empty.trade"),
    willClose: () => {
      router.back();
    },
  });
};

export const financial = (x, point = 2) => {
  const hasPoint = x.toString().split(".").length > 1;
  if (hasPoint) return Number.parseFloat(x).toFixed(point);
  return x;
};

export function debounce(func, timeout = 300) {
  let timer; //利用封包儲存的函式
  /* ...args利用其餘參數將args拆成偽陣列 用於讓func接收所接收到的所有參數 因為apply第二個參數必須是陣列，故才攤開成偽陣列 */
  return (...args) => {
    clearTimeout(timer); //每次執行前先清空封包
    timer = setTimeout(() => {
      /* apply將會馬上執行func。而因為settimeout使用箭頭函數，所以apply抓到的this是調用debounce的函式 */
      func.apply(this, args);
    }, timeout);
  };
}

export const openUrl = (url, isBlank = false) => {
  const a = document.createElement("a");
  a.setAttribute("href", url);
  if (isBlank) a.setAttribute("target", "_blank");
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
};

//! @deprecated
export const crossDay = () => {
  const today = new Date();
  const currentDate = today.toISOString().slice(0, 10); // 格式化為 "YYYY-MM-DD"
  const savedDate = storage.get("crossDay"); // 取得已儲存的日期
  storage.set("crossDay", currentDate); // 設定今日日期
  /* 若無儲存日期，則直接判斷為跨日 */
  if (!savedDate) {
    return true;
  }
  /* 比較當前日期與 localStorage 中的日期 */
  const isCrossDay = currentDate !== savedDate;
  return isCrossDay;
};

export const executeCallback = async (
  callback,
  times,
  timeout = 3000,
  count = 0
) => {
  if (count >= times) {
    return false;
  }
  const result = await callback();
  if (!result) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(executeCallback(callback, times, timeout, count + 1));
      }, timeout);
    });
  }
  return true;
};

//! @deprecated
export const getNewData = (localName, newData, judgmentName, judgmentThing) => {
  // 取得本地儲存資料，如果無資料則設定為空陣列
  let already = storage.get(localName) || [];

  // 複製新的資料
  let data = [...newData];

  // 在已存在的資料中查找是否有名稱符合judgmentName的資料，有則回傳該資料物件，無則回傳undefined
  let existing = already.find((data) => data.name === judgmentName);

  // 建立一個暫存物件，包含名稱、已存在的識別資訊和該資料在陣列中的索引
  // 如果在已存在的資料中找不到相符的名稱，則設定ids為空陣列，index為-1
  let temp = {
    name: judgmentName,
    ids: existing ? [...existing.ids] : [],
    index: existing ? already.indexOf(existing) : -1,
  };

  // 在新的資料中篩選出尚未存在於暫存物件中的識別資訊，並將這些識別資訊加入暫存物件中
  let never = data.filter((item) => {
    if (!temp.ids.includes(item[judgmentThing])) {
      temp.ids.push(item[judgmentThing]);
      return true;
    }
    return false;
  });

  // 如果在已存在的資料中找到相符的名稱，則使用新的暫存物件取代原本的資料
  // 如果找不到相符的名稱，則將新的暫存物件加入已存在的資料中
  if (temp.index !== -1) {
    already[temp.index] = temp;
  } else {
    already.push(temp);
  }

  console.log("寫入");
  // 將更新後的已存在的資料儲存回本地
  storage.set(localName, already);

  // 回傳只在新資料中存在的資料
  return never;
};

export const checkPhone = async (option) => {
  const i18n = useI18nService();
  const alertService = useAlertService();

  const { phone } = option;
  const isAlert = phone;
  if (!isAlert) {
    return "/discount";
  }
  const { isConfirmed } = await alertService.confirm({
    title: i18n.t(`app.dialog.setphone.title`),
    text: i18n.t(`app.dialog.setphone.text`),
  });
  if (!isConfirmed) return "cancel";
  return "/account/phone";
};

export const setString = (str, n = 2, mask = "****") => {
  const first = str.substr(0, n); // 取前 n 個字
  const last = str.substr(-n, n); // 取後 n 個字
  return `${first}${mask}${last}`;
};

export const highlightText = (elementId, searchText, color) => {
  // 獲取 DOM 元素
  let element = document.getElementById(elementId);

  // 確保元素存在並且包含文本
  if (element && element.innerHTML) {
    // 創建一個正則表達式以找到我們要突出顯示的文本
    let regex = new RegExp(searchText, "g");

    // 替換所有匹配的文本以添加高亮顯示
    element.innerHTML = element.innerHTML.replace(
      regex,
      `<span style="color: ${color}">${searchText}</span>`
    );
  }
};

export const keywordSetColor = (inputString, searchText, color) => {
  // 創建一個正則表達式以找到我們要突出顯示的文本
  let regex = new RegExp(searchText, "g");

  // 替換所有匹配的文本以添加高亮顯示
  let highlightedString = inputString.replace(
    regex,
    `<span style="color: ${color}">${searchText}</span>`
  );

  // 返回高亮字符串
  return highlightedString;
};

export const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const maskAccount = (account) => {
  if (!account) return;
  return account.replace(/(.{2})(.*)(.{2})/, (match, p1, p2, p3) => {
    // let middle = "*".repeat(p2.length);
    // // 如果中間字元數超過10，就只顯示前10個和省略號
    // if (p2.length > 10) {
    //   middle = middle.substring(0, 10);
    // }
    // return p1 + middle + p3;
    return p1 + "***" + p3; // 固定三顆*
  });
};
