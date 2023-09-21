import { defineService } from "@/_app/_define";
import { useWebsocketProvider } from "@/providers/websockt-provider";
import { useChatApiService } from "./chat-api-service";
import {
  toBackEndSource,
  toBackEndType,
  toFrontEndSource,
  toFrontEndType,
} from "@/widgets/components/the-chat/_lib";
import { nanoid } from "nanoid";

export const useChatWebsocketService = defineService("chat-ws-service", () => {
  const provider = useWebsocketProvider().new();
  const apiService = useChatApiService();

  return {
    provider,

    chatId: null,
    account: null,
    lang: null,
    messageListeners: [],
    _messageIndex: 0,
    responseListeners: [],
    _responseIndex: 0,

    /**
     * 參考 https://socket.io/docs/v4/client-api/#events
     */
    connect(url, options, events = {}) {
      this.chatId = options.chatId;
      this.account = options.account;
      this.lang = options.lang;

      this.provider.connect(url, {
        reconnection: false,
        transports: ["websocket"],
      });
      this.provider.on("connect", () => {
        console.debug("%cWEBSOKET: Connection open.", "color:red;");
        events.onOpen?.();
      });
      this.provider.on("disconnect", () => {
        console.debug("%cWEBSOKET: Connection closed.", "color:red;");
        this.clearListeners();
        events.onClose?.();
      });
      this.provider.on("connect_error", (error) => {
        console.debug("%cWEBSOKET: Error.", "color:red;", error.message);
        this.clearListeners();
        events.onError?.(error);
      });
      // ...其他 event 有需要再補

      /**
       * ==============================================================
       * custom events
       * ==============================================================
       */

      this.provider.on("message", (event) => {
        const { event_name, ...payload } = event;
        switch (event_name) {
          case "join":
            console.debug("%cWEBSOKET: Chat Joined.", "color:red;", payload);
            events.onJoin?.(payload);
            break;

          /** 請求通知 */
          case "response":
            console.debug(
              "%cWEBSOKET: Received Response.",
              "color:red;",
              event
            );
            this.responseListeners.forEach((listener) => {
              listener.callback(payload);
            });
            break;

          /** 訊息通知 */
          case "broadcast":
            if (payload.sender !== this.account) {
              /** 收到自己的廣播不處理 */
              console.debug(
                "%cWEBSOKET: Received Broadcast.",
                "color:red;",
                event
              );

              /** 參數轉換 */
              const { source, type } = payload;
              const convert = {
                ...payload,
                type: toFrontEndType(type),
                source: toFrontEndSource(source),
              };

              this.messageListeners.forEach((listener) => {
                listener.callback(convert);
              });
            }
            break;
        }
      });
    },

    clearListeners() {
      this.messageListeners = [];
      this.responseListeners = [];
      this._messageIndex = 0;
      this._responseIndex = 0;
    },

    disconnect() {
      this.provider.disconnect();
    },

    destroy() {
      this.clearListeners();
      this.provider.destroy();
    },

    attachResponseEvent(callback) {
      const id = this._responseIndex;
      const subject = {
        id,
        callback,
        detach: this.detachResponseEvent.bind(this, id),
      };
      this.responseListeners = [...this.responseListeners, subject];
      this._responseIndex += 1;
      return subject;
    },

    detachResponseEvent(listenerId) {
      this.responseListeners = this.responseListeners.filter(
        (listener) => listener.id !== listenerId
      );
    },

    attachMessageEvent(callback) {
      const id = this._messageIndex;
      const subject = {
        id,
        callback,
        detach: this.detachMessageEvent.bind(this, id),
      };
      this.messageListeners = [...this.messageListeners, subject];
      this._messageIndex += 1;
      return subject;
    },

    detachMessageEvent(listenerId) {
      this.messageListeners = this.messageListeners.filter(
        (listener) => listener.id !== listenerId
      );
    },

    join() {
      this.provider.emit("join", {
        chat_id: this.chatId,
        account: this.account,
        source: "user",
        ...apiService.getAgentParams(),
      });
    },

    generateHashId() {
      return nanoid();
    },

    send(payload) {
      const hash_id = payload.hashId ?? this.generateHashId();
      this.provider.emit("message", {
        chat_id: this.chatId,
        sender: this.account,
        type: toBackEndType(payload.type),
        message: payload.message,
        hash_id,
        source: toBackEndSource(payload.source),
        lang: this.lang,
        ...apiService.getAgentParams(),
      });
      return hash_id;
    },
  };
});
