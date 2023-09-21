import { defineService } from "@/_app/_define";
import { useAppStore } from "@/store/app-store";
import { useChatHttpService } from "@/services/chat-http-service";

/** workers */
import UploadWorker from "@/workers/upload-worker?worker";

/** helper */
import md5 from "crypto-js/md5";
import { format } from "date-fns";

export const useChatApiService = defineService("chat-api-service", () => {
  const chatHttpService = useChatHttpService();
  const http = chatHttpService.http();
  const CHAT_AGENT_ID = import.meta.env.VITE_CHAT_AGENT_ID;
  const CHAT_AGENT_KEY = import.meta.env.VITE_CHAT_AGENT_KEY;

  const generateAgentKey = () => {
    const datetimeStr = format(new Date(), "yyyyMMddHHmmss");
    const encode = md5(`${CHAT_AGENT_KEY}${datetimeStr}`).toString();
    return `${encode}${datetimeStr}`;
  };

  return {
    excute() {
      const appStore = useAppStore();
      chatHttpService.excute(appStore.chatUrl);
    },

    getAgentParams() {
      return {
        agent_id: CHAT_AGENT_ID,
        agent_key: generateAgentKey(),
      };
    },

    async login(payload) {
      return http.post(
        "/login",
        {
          agent_id: CHAT_AGENT_ID,
          agent_key: generateAgentKey(),
          account: payload.account,
        },
        {
          isFormData: true,
        }
      );
    },

    async getGuestAccount() {
      return http.get("/generate_uuid", {
        params: {
          agent_id: CHAT_AGENT_ID,
          agent_key: generateAgentKey(),
        },
        isFormData: true,
      });
    },

    async translate(payload) {
      const appStore = useAppStore();
      const messageObj = {};
      if (Array.isArray(payload.messages)) {
        messageObj["messages"] = payload.messages;
      } else {
        for (let msg in payload.messages) {
          messageObj[`messages[${msg}]`] = payload.messages[msg];
        }
      }
      return http.post(
        "/translate",
        {
          agent_id: CHAT_AGENT_ID,
          agent_key: generateAgentKey(),
          lang: appStore.locale,
          ...messageObj,
        },
        {
          isFormData: true,
        }
      );
    },

    async uploadImage(payload) {
      const uploadWorker = new UploadWorker();
      return new Promise((resolve) => {
        uploadWorker.addEventListener(
          "message",
          (payload) => {
            resolve(payload.data);
          },
          { once: true }
        );
        uploadWorker.postMessage({
          origin: new URL("/upload_img", http.defaults.baseURL).href,
          payload: {
            agent_id: CHAT_AGENT_ID,
            agent_key: generateAgentKey(),
            image: payload.file,
          },
        });
      });
    },

    async uploadMedia(payload) {
      const uploadWorker = new UploadWorker();
      return new Promise((resolve) => {
        uploadWorker.addEventListener(
          "message",
          (payload) => {
            resolve(payload.data);
          },
          { once: true }
        );
        uploadWorker.postMessage({
          origin: new URL("/upload_video", http.defaults.baseURL).href,
          payload: {
            agent_id: CHAT_AGENT_ID,
            agent_key: generateAgentKey(),
            video: payload.file,
          },
        });
      });
    },

    async getHistoryMessages(payload) {
      return http.get("/chats", {
        params: {
          agent_id: CHAT_AGENT_ID,
          agent_key: generateAgentKey(),
          chat_id: payload.chatId,
          flag: payload.flag,
          limit: payload.limit,
        },
      });
    },
  };
});
