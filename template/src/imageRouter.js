/** 會員稱號 */
import cover0 from "@/assets/images/account/vip/vip_0.png";
import cover1 from "@/assets/images/account/vip/vip_1.png";
import cover2 from "@/assets/images/account/vip/vip_2.png";
import cover3 from "@/assets/images/account/vip/vip_3.png";
import enRule0 from "@/assets/images/account/vip/en/title0.jpg";
import enRule1 from "@/assets/images/account/vip/en/title1.jpg";
import enRule2 from "@/assets/images/account/vip/en/title2.jpg";
import enRule3 from "@/assets/images/account/vip/en/title3.jpg";
import viRule0 from "@/assets/images/account/vip/vi/title0.jpg";
import viRule1 from "@/assets/images/account/vip/vi/title1.jpg";
import viRule2 from "@/assets/images/account/vip/vi/title2.jpg";
import viRule3 from "@/assets/images/account/vip/vi/title3.jpg";
import phRule0 from "@/assets/images/account/vip/ph/title0.jpg";
import phRule1 from "@/assets/images/account/vip/ph/title1.jpg";
import phRule2 from "@/assets/images/account/vip/ph/title2.jpg";
import phRule3 from "@/assets/images/account/vip/ph/title3.jpg";

/** 帳號vip */
import vip0 from "@/assets/images/account/vip/vip_0.png";
import vip1 from "@/assets/images/account/vip/vip_1.png";
import vip2 from "@/assets/images/account/vip/vip_2.png";
import vip3 from "@/assets/images/account/vip/vip_3.png";
// small
import vip0_sm from "@/assets/images/account/vip/vip_0_sm.png";
import vip1_sm from "@/assets/images/account/vip/vip_1_sm.png";
import vip2_sm from "@/assets/images/account/vip/vip_2_sm.png";
import vip3_sm from "@/assets/images/account/vip/vip_3_sm.png";

/** banner */
import image1 from "@/assets/images/banner/banner_default_bg_logo.png";

import birdRank1 from "@/assets/images/home/banner_bird_1.png";
import birdRank2 from "@/assets/images/home/banner_bird_2.png";
import birdRank3 from "@/assets/images/home/banner_bird_3.png";
import birdRank4 from "@/assets/images/home/banner_bird_4.png";
import birdRank5 from "@/assets/images/home/banner_bird_5.png";
import birdRank6 from "@/assets/images/home/banner_bird_6.png";
import birdRank7 from "@/assets/images/home/banner_bird_7.png";
import birdRank8 from "@/assets/images/home/banner_bird_8.png";
import birdRank9 from "@/assets/images/home/banner_bird_9.png";
import birdRank10 from "@/assets/images/home/banner_bird_10.png";

/* 推廣教程 */
import zh from "@/assets/images/recommend/zh.jpg";
import vi from "@/assets/images/recommend/vi.jpg";
import ph from "@/assets/images/recommend/ph.jpg";

/* 會員稱號-vip */
export const titleCoverImage = () => {
  return [cover0, cover1, cover2, cover3];
};
/* 會員稱號-解說 */
export const titleRuleImage = (lang) => {
  const images = {
    en: [enRule0, enRule1, enRule2, enRule3],
    tw: [enRule0, enRule1, enRule2, enRule3],
    vn: [viRule0, viRule1, viRule2, viRule3],
    ph: [phRule0, phRule1, phRule2, phRule3],
  };
  return images[lang] ?? images["vn"];
};

/* 我的-vip等級 */
export const accountImage = () => {
  return [
    { normal: vip0, small: vip0_sm },
    { normal: vip1, small: vip1_sm },
    { normal: vip2, small: vip2_sm },
    { normal: vip3, small: vip3_sm },
  ];
};

/* banner預設圖 */
export const bannerImage = () => {
  return [image1];
};
/* banner 鳳凰等級 */
export const rankIcon = (rank) => {
  return [
    birdRank1,
    birdRank2,
    birdRank3,
    birdRank4,
    birdRank5,
    birdRank6,
    birdRank7,
    birdRank8,
    birdRank9,
    birdRank10,
  ][rank];
};

/* 推廣教程 */
export const teachImage = (lang) => {
  const images = {
    tw: zh,
    vn: vi,
    ph: ph,
  };
  return images[lang] ?? images["vn"];
};

/** @george 備註 */
/* 除此之外還有
  1.登入頁註冊頁面logo
  2.首頁logo
  3.提款的卡片logo (withdraw.js 
  但以上這幾項會根據環境變數自動設定class
  只需要新增圖片及從css設定即可
*/
