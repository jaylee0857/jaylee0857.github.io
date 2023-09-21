import { defineStore } from "pinia";
import { useAuthStore } from "./auth-store";
import { useAppStore } from "./app-store";

/** services */
import { useApiService } from "@/services/api-service";
import { useChatApiService } from "@/services/chat-api-service";
import { useI18nService } from "@/services/i18n-service";

/** helper */
import {
  update,
  remove,
  findIndex,
  reduce,
  map,
  filter,
  isEmpty,
  pluck,
} from "ramda";
import { nanoid } from "nanoid";
import { subHours, differenceInHours } from "date-fns";
import {
  MESSAGE_TYPE,
  CONNECT_STATUS,
  MESSAGE_STATUS,
  MESSAGE_SOURCE,
  toFrontEndSource,
  toFrontEndType,
} from "@/widgets/components/the-chat/_lib";

export const useChatStore = defineStore("chat-store", {
  state: () => ({
    display: false /** 視窗開關旗標 */,
    connectStatus: CONNECT_STATUS.PENDING /** 連線狀態 */,
    categories: [] /** 分類 */,
    items: {} /** 項目，以分類作為鍵值 */,
    bot: {} /** 客服頭像 */,
    welcomeMessageRequestAt: {} /** 歡迎訊息發送時間，以帳號為鍵值 */,
    messages: [] /** 訊息 */,
    account: null /** 聊天室帳號 */,
    chatId: null /** 聊天室id */,
  }),
  persist: {
    enabled: true,
    strategies: [
      {
        key: "welcomeMessageRequestAt",
        storage: localStorage,
        paths: ["welcomeMessageRequestAt"],
      },
    ],
  },
  actions: {
    open() {
      this.display = true;
    },
    close() {
      this.display = false;
    },
    clear() {
      this.clearMessages();
      this.account = null;
      this.chatId = null;
    },
    setConnectStatus(payload) {
      this.connectStatus = payload;
    },
    clearMessages() {
      this.messages = [];
    },
    clearQuestions() {
      this.categories = [];
      this.items = {};
    },
    appendToMessages(payload) {
      this.messages = [
        ...this.messages,
        {
          uuid: nanoid(),
          type: payload.type,
          sender: {
            account: "",
            nickname: "",
            avatar: "",
            ...payload.sender,
          },
          source: payload.source,
          status: payload.status,
          hashId: payload.hashId ?? null,
          message: payload.message,
          time: payload.time,
          timeoutRace: payload.timeoutRace,
        },
      ];
    },

    /**
     * 拿歡迎訊息
     * @desc
     * 向後端請求進入聊天室的歡迎訊息
     * 在有登入的情況下會記錄請求時間，六個小時內不重複請求
     *
     * @param {Object} payload
     * @returns {Array<string>} 訊息內容陣列
     *
     * payload
     * @property {string} account 聊天室帳號
     */
    async getChatWelcomeMessage(payload) {
      const api = useApiService();
      const authStore = useAuthStore();
      const rootMessages = useI18nService();
      const user = payload.account;

      /** 6 小時拿一次 */
      if (user in this.welcomeMessageRequestAt) {
        const sendAt = this.welcomeMessageRequestAt[user];
        const diffHours = differenceInHours(new Date(), new Date(sendAt));
        if (diffHours < 6) return [];
      }

      const response = await api.getChatWelcomeMessage();
      if (response.code === 1 && response.data.length > 0) {
        if (authStore.isLogin) {
          this.welcomeMessageRequestAt = {
            ...this.welcomeMessageRequestAt,
            [user]: Date.now(),
          };
        }
        return pluck("msg", response.data);
      } else {
        return [rootMessages.t("widgets.chat.welcome.message")];
      }
    },

    /**
     * 更新訊息狀態
     * @param {Object} payload
     *
     * payload
     * @property {string} hashId 訊息識別值
     * @property {MESSAGE_STATUS} status 訊息狀態
     */
    updateMessageStatus(payload) {
      const targetIdx = findIndex(
        (message) => message.hashId === payload.hashId,
        this.messages
      );
      if (targetIdx > -1)
        this.messages = update(
          targetIdx,
          {
            ...this.messages[targetIdx],
            status: payload.status,
          },
          this.messages
        );
    },

    /**
     * 移除訊息
     * @desc
     * 用在發送失敗時，提供使用者的刪除操作
     * @param {Object} payload
     *
     * payload
     * @property {string} hashId 訊息識別值
     */
    removeMessage(payload) {
      const targetIdx = findIndex(
        (message) => message.hashId === payload.hashId,
        this.messages
      );
      if (targetIdx > -1) this.messages = remove(targetIdx, 1, this.messages);
    },

    /**
     * 檔案上傳
     * @desc
     * 依照 mimeType 區分要請求的 api
     *
     * @param {Object} payload
     * @returns {Object}
     *
     * payload
     * @property {'image' | 'video'} mimeType 檔案類型
     * @property {file} file 檔案
     */
    async uploadFile(payload) {
      const api = useChatApiService();
      if (payload.mimeType === "image") {
        const res = await api.uploadImage({
          file: payload.file,
        });
        return {
          code: res.code,
          data: {
            url: res.data[0]?.img_url,
          },
        };
      } else {
        const res = await api.uploadMedia({
          file: payload.file,
        });
        return {
          code: res.code,
          data: {
            url: res.data[0]?.video_url,
          },
        };
      }
    },

    /**
     * 拿客服頭像與名字
     */
    async getChatBotInfo() {
      const api = useApiService();
      const res = await api.getChatBotInfo();
      if (res.code === 1) {
        this.bot = {
          avatar: res.data.avatar,
          name: res.data.name,
        };
      }
      return res;
    },

    /**
     * 問題分類
     */
    async getQuestionCategories() {
      const api = useApiService();
      const res = await api.getQuestionCategories();
      if (res.code === 1) {
        this.categories = res.data;
      }
      return res;
    },

    /**
     * 問題分類子項
     */
    async getQuestionItems(payload) {
      const api = useApiService();
      const res = await api.getQuestionItems({
        categoryId: payload.categoryId,
      });
      if (res.code === 1) {
        this.items = {
          ...this.items,
          [payload.categoryId]: res.data,
        };
      }
      return res;
    },

    /**
     * 啟動聊天 api
     * @desc
     * 因為聊天的 api host 是透過撈取
     * 這個操作將 appStore.chatUrl 寫入 chatHttpService
     */
    excute() {
      const api = useChatApiService();
      api.excute();
    },

    /**
     * 登入聊天室
     * @desc
     * 有登入者使用登入帳號
     * 訪客則先跟後端要一組訪客用帳號來登入
     * 登入後會拿到聊天室id
     */
    async login() {
      const authStore = useAuthStore();
      const api = useChatApiService();
      let account;
      if (authStore.isLogin) {
        account = authStore.user.account;
      } else {
        const guestRes = await api.getGuestAccount();
        if (guestRes.code !== 1) {
          return { code: guestRes.code };
        }
        account = guestRes.data[0].uuid;
      }

      const res = await api.login({
        account,
      });
      if (res.code !== 1) {
        return { code: res.code };
      }
      const [{ chat_id: chatId }] = res.data;

      this.account = account;
      this.chatId = chatId;

      return {
        code: 1,
        data: {
          account,
          chatId,
        },
      };
    },

    /**
     * 翻譯
     * @param {Array|Object<string, string>} payload
     * @returns 翻譯失敗會回傳空物件
     *
     * @example
     *  translate({
     *    keyA: "你好",
     *    keyB: "再見",
     *  })
     *  => [{messages: { keyA: "Hello", keyB: "Goodbye" }}]
     */
    async translate(payload) {
      const api = useChatApiService();
      const res = await Promise.race([
        /**
         * 翻譯可能很久
         * 加個 30 秒競賽
         */
        api.translate({
          messages: payload.messages,
        }),
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({ code: 0 });
          }, 30000);
        }),
      ]);
      if (res.code === 1) {
        return res.data[0].messages;
      }
      return {};
    },

    /**
     * 歷史訊息
     */
    async getHistoryMessages() {
      const appStore = useAppStore();
      const api = useChatApiService();
      const flag = filter(
        (message) =>
          message.status === MESSAGE_STATUS.SUCCESS &&
          ![
            MESSAGE_TYPE.BULLETIN,
            MESSAGE_TYPE.FEEDBACK,
            //
          ].includes(message.type),
        this.messages
      ).length;
      const res = await api.getHistoryMessages({
        chatId: this.chatId,
        flag,
        limit: 20,
      });

      if (res.code === 1) {
        const addUuid = map((msg) => ({ ...msg, uuid: nanoid() }), res.data);
        /**
         * 篩選出來自[非登入帳號]發送的[客服]的[文字]訊息，去翻譯
         */
        const messages = reduce(
          (obj, msg) => {
            if (
              msg.sender !== this.account &&
              toFrontEndSource(msg.source) === MESSAGE_SOURCE.BOT &&
              toFrontEndType(msg.type) === MESSAGE_TYPE.TEXT &&
              msg.lang !== appStore.locale
            ) {
              return { ...obj, [msg.uuid]: msg.text };
            }
            return obj;
          },
          {},
          addUuid
        );
        let translateMap = {};
        if (!isEmpty(messages)) {
          translateMap = await this.translate({
            messages,
          });
        }

        /** 格式轉換 */
        this.messages = [
          ...map(
            (msg) => ({
              uuid: msg.uuid,
              type: toFrontEndType(msg.type),
              source: toFrontEndSource(msg.source),
              status: MESSAGE_STATUS.SUCCESS,
              hashId: msg.hash_id,
              message: translateMap[msg.uuid] ?? msg.text,
              sender: {
                account: msg.sender,
                nickname: msg.sender_nickname,
                avatar: msg.sender_avatar,
              },
              time: subHours(new Date(msg.send_at), 8),
              timeoutRace: null,
            }),
            addUuid
          ),
          ...this.messages,
        ];
      }
      return res;
    },
  },
});
