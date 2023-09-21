import { defineService } from "@/_app/_define";
import { useHttpService } from "@/services/http-service";
import { useAuthStore } from "@/store/auth-store";
import { useAppStore } from "@/store/app-store";

export const useApiService = defineService("api-service", () => {
  const http = useHttpService();

  return {
    async login(payload) {
      return http.post("/app/user/login", {
        account: payload.account,
        password: payload.password,
      });
    },

    async logout() {
      return http.get("/app/user/logout", {
        novalidate: true,
        noredirect: true,
      });
    },

    async sendCaptcha(payload) {
      return http.post(
        "/app/sms",
        {
          phone: payload.phone,
          type: payload?.type ?? 0 /** {0|1|2} -> {綁手機|忘記密碼|出款} */,
          provider: import.meta.env.VITE_SMS || "every8d",
        },
        {
          novalidate: true,
          noredirect: true,
        }
      );
    },

    async register(payload) {
      const appStore = useAppStore();
      return http.post(
        "/app/user/register",
        {
          account: payload.account, //帳號
          password: payload.password, //密碼
          password_confirmation: payload.passwordConfirmed, //確認密碼
          phone: payload.phone,
          captcha: payload.captcha,
          register_ip: appStore.userIP,
          register_device: payload.deviceInfo,
          type: 0,
        },
        {
          novalidate: true,
          noredirect: true,
        }
      );
    },

    /** 設定推薦人 */
    async postPromoteCode() {
      const appStore = useAppStore();
      return http.post(
        "/app/user/introducer",
        {
          promote_code: appStore.promoteCode,
        },
        {
          novalidate: true,
          noredirect: true,
        }
      );
    },

    /** 寫入推廣流量數據 */
    async postPromoteStats(payload) {
      const appStore = useAppStore();
      return http.post(
        "/app/set-network-stats",
        {
          ip: appStore.userIP,
          account: payload.account,
          endpoint: "h5",
          date: payload.date,
          domain: payload.domain,
        },
        {
          novalidate: true,
          noredirect: true,
        }
      );
    },

    async getUser() {
      const appStore = useAppStore();
      return http.get("/app/user", {
        params: {
          public_ip: appStore.userIP,
        },
        novalidate: true,
        noredirect: true,
      });
    },

    /** 修改密碼 */
    async updatePassword(payload) {
      return http.post(
        "/app/user/update-password",
        {
          old_password: payload.old_password,
          password: payload.password,
          password_confirmation: payload.password_confirmation,
        },
        {
          novalidate: true,
          noredirect: true,
        }
      );
    },

    /** 修改大頭照 */
    async updateAvatar(payload) {
      return http.post(
        "/app/user/avatar",
        { image: payload.image },
        {
          novalidate: true,
          noredirect: true,
          isFormData: true,
        }
      );
    },

    /** 修改暱稱 */
    async updateName(payload) {
      return http.post(
        "/app/user",
        {
          nickname: payload.nickname,
        },
        {
          novalidate: true,
          noredirect: true,
        }
      );
    },

    /** 修改性別 */
    async updateGender(payload) {
      return http.post(
        "/app/user",
        {
          sex: payload.sex,
        },
        {
          novalidate: true,
          noredirect: true,
        }
      );
    },

    /** 修改生日 */
    async updateBirthday(payload) {
      return http.post(
        "/app/user",
        {
          birthday: payload.birthday,
        },
        {
          novalidate: true,
          noredirect: true,
        }
      );
    },

    /** 設定手機 */
    async updatePhone(payload) {
      return http.post(
        "/app/user",
        {
          phone: payload.phone,
          captcha: payload.captcha,
        },
        {
          novalidate: true,
          noredirect: true,
        }
      );
    },

    /** 重設密碼 */
    async resetPassword(payload) {
      return http.post(
        "/app/forget-password",
        {
          password: payload.password,
          password_confirmation: payload.password_confirmation,
          phone: payload.phone,
          captcha: payload.captcha,
        },
        {
          novalidate: true,
          noredirect: true,
        }
      );
    },

    /** 取得新會員的相關通知 */
    async getNoviceTask() {
      return http.get("/app/user/novice-task", {
        novalidate: true,
        noredirect: true,
      });
    },

    /** 更新新會員的相關通知 */
    async updateNoviceTask(payload) {
      return http.post(
        "/app/user/novice-task",
        {
          [payload.type]: 1,
        },
        {
          novalidate: true,
          noredirect: true,
        }
      );
    },

    /** 撈通知 */
    async getNotify() {
      return http.get("/app/user/notify-update-list", {
        novalidate: true,
        noredirect: true,
      });
    },

    /** 已讀通知 */
    async updateNotify(payload) {
      return http.post("/app/user/notify-update-list", payload, {
        novalidate: true,
        noredirect: true,
      });
    },

    /** 輪播圖 */
    async getBanner() {
      return http.get("/app/banners", {
        params: {
          device: "mobile",
        },
        novalidate: true,
        noredirect: true,
      });
    },

    /**
     * 輪播圖的排行 / 我的 的vip倒數 / 優惠的vip升級資訊
     */
    async getRank() {
      return http.get("/app/vip-upgrade-list", {
        novalidate: true,
        noredirect: true,
      });
    },

    /** 取得跑馬燈 */
    async getMarquees() {
      return http.get("/app/user/news", {
        params: { type: 1 },
        novalidate: true,
        noredirect: true,
      });
    },

    /** 取得所有公告 */
    async getAllBulletin() {
      return http.get("/app/user/news", {
        novalidate: true,
        noredirect: true,
      });
    },

    /** 已讀限時 */
    async updateLimited(payload) {
      return http.post(
        "/app/user/update-news",
        {
          id: payload.id, //活動id
          read_lock: payload.read_lock, //是否不再提示 後端不會再回傳
        },
        {
          novalidate: true,
          noredirect: true,
        }
      );
    },

    /** 其他人的出款訊息 */
    async getOthersWithdrawMessages() {
      return http.get("/app/withdraw", {
        novalidate: true,
        noredirect: true,
      });
    },

    /** 小遊戲遊玩次數 */
    async getAddition() {
      const authStore = useAuthStore();
      return http.get("/addition/receive-left", {
        params: {
          phone: authStore.user.phone,
        },
        novalidate: true,
        noredirect: true,
      });
    },

    /** 取得遊戲 */
    async getGames(payload) {
      const http = useHttpService();
      const appStore = useAppStore();
      return http.get("/app/games", {
        params: {
          type: payload?.type ?? null,
          lang: appStore.locale,
        },
        novalidate: true,
        noredirect: true,
      });
    },

    /** 取得遊戲語系 */
    async getGameLocales() {
      const http = useHttpService();
      const appStore = useAppStore();
      return http.get("/app/games/lang", {
        params: {
          lang: appStore.locale,
        },
        novalidate: true,
        noredirect: true,
      });
    },

    /** 額度鎖定/解鎖 */
    async updateCreditLock(payload) {
      const http = useHttpService();
      return http.post(
        "/app/user/lock-credit",
        {
          lock: payload.lock,
          platform: payload.platform,
          game: payload.game,
        },
        {
          novalidate: true,
          noredirect: true,
        }
      );
    },

    /** 取得遊戲跳轉網址 */
    async getGameForward(payload) {
      const http = useHttpService();
      const appStore = useAppStore();
      return http.get("/app/forward", {
        params: {
          platform: payload.platform,
          game: payload.game,
          lang: appStore.locale,
        },
        novalidate: true,
        noredirect: true,
      });
    },

    /** 取得app下載網址 */
    async getDownloadUrl() {
      const http = useHttpService();
      return http.get("/app/download-promote-channel", {
        noredirect: true,
        novalidate: true,
      });
    },

    /** 取得服務網址 */
    async getServiceUrl() {
      const http = useHttpService();
      return http.get("/app/dialogue-url", {
        noredirect: true,
        novalidate: true,
      });
    },

    /** 充提贈點-活動資訊 */
    async getPaymentActivity() {
      const http = useHttpService();
      return http.get("/app/activity/deposit-withdraw/info", {
        novalidate: true,
        noredirect: true,
      });
    },

    /** 會員銀行列表 */
    async getPaymentBankbooks() {
      const authStore = useAuthStore();
      const http = useHttpService();
      return http.get("/app/user/bankbook", {
        params: {
          account: authStore.user.account, // 會員帳號
        },
        novalidate: true,
        noredirect: true,
      });
    },

    /** 取得銀行列表 */
    async getPaymentBankOptions() {
      const http = useHttpService();
      const res = await http.get("/app/bank", {
        novalidate: true,
        noredirect: true,
      });
      return res;
    },

    /** 新增會員銀行帳戶 */
    async createPaymentBankCard(payload) {
      const http = useHttpService();
      const res = await http.post(
        "/app/user/bankbook/create",
        {
          type: "1",
          image: payload.coverFile, // 存簿照片
          user_id_image: payload.userIdFile, // 證件封面圖片
          selfie_image: payload.selfieFile, // 手持證件照
          bank_name: payload.bankName, // 存簿銀行名稱
          bank_number: payload.bankNumber, // 存簿銀行代碼
          bankbook_username: payload.owner, // 存簿持有人
          bankbook_account: payload.account, // 存簿帳號
        },
        {
          isFormData: true,
          novalidate: true,
          noredirect: true,
        }
      );
      return res;
    },

    /** 更新會員銀行帳戶 */
    async updatePaymentBankCard(payload) {
      const http = useHttpService();
      const res = await http.post(
        "/app/user/bankbook/update",
        {
          id: payload.id,
          type: "1",
          image: payload.coverFile, // 存簿照片
          user_id_image: payload.userIdFile, // 證件封面圖片
          selfie_image: payload.selfieFile, // 手持證件照
          bank_name: payload.bankName, // 存簿銀行名稱
          bank_number: payload.bankNumber, // 存簿銀行代碼
          bankbook_username: payload.owner, // 存簿持有人
          bankbook_account: payload.account, // 存簿帳號
        },
        {
          isFormData: true,
          novalidate: true,
          noredirect: true,
        }
      );
      return res;
    },

    /** 會員出款方式 */
    async getPaymentChannels() {
      const http = useHttpService();
      return http.get("/app/payment/withdraw/channels", {
        novalidate: true,
        noredirect: true,
      });
    },

    /** 取得出款洗碼量 */
    async getPaymentWashAmount() {
      const http = useHttpService();
      return http.get("/app/payment/wash-amount", {
        novalidate: true,
        noredirect: true,
      });
    },

    /** 出款 */
    async postPaymentWithdraw(payload) {
      const http = useHttpService();
      return http.post(
        "/app/payment/withdraw",
        {
          account_id: payload.accountId,
          amount: payload.amount,
        },
        {
          novalidate: true,
          noredirect: true,
        }
      );
    },

    /** 充提贈點-領獎 */
    async postPaymentReceive() {
      const http = useHttpService();
      return http.post(
        "/app/activity/deposit-withdraw/receive",
        {},
        {
          novalidate: true,
          noredirect: true,
        }
      );
    },

    /** 序號贈點-序號兌獎 */
    async postRedemption(payload) {
      const http = useHttpService();
      return http.post(
        "/app/activity/serial-number/redemption",
        {
          serial_number: payload.sn,
        },
        {
          novalidate: true,
          noredirect: true,
        }
      );
    },

    /** 優惠-優惠列表 */
    async getDiscounts() {
      return await http.get("/app/promotes", {
        novalidate: true,
        noredirect: true,
      });
    },

    /** 優惠-優惠列表 */
    async applyDiscount(payload) {
      return await http.post("/app/promotes/apply", {
        action: payload.discountType,
        promote_id: payload.discountId,
      });
    },

    /** 優惠-VIP列表 */
    async getVipList() {
      return http.get("/app/vip", {
        novalidate: true,
        noredirect: true,
      });
    },

    /** live-chat */
    async getChatBotInfo() {
      const http = useHttpService();
      return http.get("/app/live-chat/service-setting", {
        novalidate: true,
        noredirect: true,
      });
    },

    async getChatWelcomeMessage() {
      const appStore = useAppStore();
      const http = useHttpService();
      return http.get("/app/live-chat/welcome-message", {
        params: {
          lang: appStore.locale,
        },
        novalidate: true,
        noredirect: true,
      });
    },

    async getQuestionCategories() {
      const appStore = useAppStore();
      const http = useHttpService();
      return http.get("/app/live-chat/question-category", {
        params: {
          lang: appStore.locale,
        },
        novalidate: true,
        noredirect: true,
      });
    },

    async getQuestionItems(payload) {
      const appStore = useAppStore();
      const http = useHttpService();
      return http.get("/app/live-chat/question", {
        params: {
          category_id: payload.categoryId,
          lang: appStore.locale,
        },
        novalidate: true,
        noredirect: true,
      });
    },
  };
});
