import { defineWorkflow } from "@/_app/_define";
import { createPassport } from "./common/core/passport";
import {
  queueOf,
  exhaustOf,
  onceOf,
  whileOnceOf,
} from "./common/core/observers";
import { withPayload } from "./common/core/operators";

/** stores */
import { useChatStore } from "@/store/chat-store";
import { useAppStore } from "@/store/app-store";
import { useAuthStore } from "@/store/auth-store";

/** services */
import { useI18nService } from "@/services/i18n-service";
import { useChatWebsocketService } from "@/services/chat-ws-service";

/** workflows */
import { usePopupWorkflow } from "./common/popup-workflow";
import { useListenerWorkflow } from "./common/listener-workflow";

/** helper */
import {
  MESSAGE_TYPE,
  MESSAGE_SOURCE,
  CONNECT_STATUS,
  MESSAGE_STATUS,
  compressImage,
} from "@/widgets/components/the-chat/_lib";
import { find, pluck, project, findIndex } from "ramda";
import { subHours } from "date-fns";

export const useChatWorkflow = defineWorkflow("chat-workflow", () => {
  const chatStore = useChatStore();
  const appStore = useAppStore();
  const authStore = useAuthStore();
  const rootMessages = useI18nService();
  const chatMessages = rootMessages.scope("widgets.chat");
  const errorMessages = rootMessages.scope("error.code");
  const chatWsService = useChatWebsocketService();
  const listenerWorkflow = useListenerWorkflow();
  const popupWorkflow = usePopupWorkflow();

  const createGetServiceUrlPassport = () => {
    const passport = createPassport(
      "app.getServiceUrl",
      appStore.getServiceUrl
      //
    );
    const observer = whileOnceOf(
      (response) => response.code === 1 && response.data.service_url !== ""
    )(passport);

    return () => observer.excute();
  };

  const createGetChatBotInfoPassport = () => {
    const passport = createPassport(
      "chat.getChatBotInfo",
      chatStore.getChatBotInfo
      //
    );
    const observer = onceOf(passport);

    return () => observer.excute();
  };

  const createGetWelcomeMessagesPassport = () => {
    const passport = createPassport(
      "chat.getChatWelcomeMessage",
      chatStore.getChatWelcomeMessage
    ).pipe(
      withPayload()
      //
    );
    const observer = exhaustOf(passport);

    return () => {
      passport.call("payload", {
        account: chatWsService.account,
      });
      return observer.excute();
    };
  };

  const createGetQuestionCategoriesPassport = () => {
    const passport = createPassport(
      "chat.getQuestionCategories",
      () =>
        new Promise((resolve) => {
          if (chatStore.categories.length > 0) {
            resolve({ code: 1, data: chatStore.categories });
          } else {
            chatStore.getQuestionCategories().then(resolve);
          }
        })

      //
    );
    const observer = queueOf(1000)(passport);

    return () => observer.excute();
  };

  const createGetQuestionItemsPassport = () => {
    const passport = createPassport(
      "chat.getQuestionItems",
      (payload) =>
        new Promise((resolve) => {
          if (payload.categoryId in chatStore.items) {
            resolve({ code: 1, data: chatStore.items[payload.categoryId] });
          } else {
            chatStore.getQuestionItems(payload).then(resolve);
          }
        })
      //
    ).pipe(
      withPayload()
      //
    );
    const observer = queueOf(1000)(passport);

    return (payload) => {
      passport.call("payload", {
        categoryId: payload.categoryId,
      });
      return observer.excute();
    };
  };

  const createGetHistoryMessagesPassport = () => {
    const passport = createPassport(
      "chat.getHistoryMessages",
      chatStore.getHistoryMessages
    );
    const observer = exhaustOf(passport);

    return () => observer.excute();
  };

  /** 啟動（寫入聊天網址 */
  const excute = async () => {
    /** 請求連結 */
    await getServiceUrl();

    switch (true) {
      case !!appStore.chatUrl:
        chatStore.excute();
        open();
        return {
          success: true,
          payload: {},
        };

      case !!appStore.zaloUrl || !!appStore.lineUrl:
        return {
          success: false,
          payload: {
            zaloUrl: appStore.zaloUrl,
            lineUrl: appStore.lineUrl,
          },
        };

      default:
        /** 提示沒有客服，稍後重試 */
        popupWorkflow.alert({
          title: rootMessages.t("app.dialog.system.title"),
          text: chatMessages.t("no.link"),
        });
        return {
          success: false,
          payload: {},
        };
    }
  };

  /**
   * 視窗縮小
   */
  const zoomOut = () => {
    chatStore.close();

    /** 未連線成功就斷線 */
    if (chatStore.connectStatus !== CONNECT_STATUS.SUCCESS) {
      if (chatWsService.provider.io) chatWsService.destroy();
      chatStore.setConnectStatus(CONNECT_STATUS.PENDING);
    }
  };

  /**
   * 視窗關閉
   */
  const close = () => {
    chatStore.close();
    chatStore.clear();

    if (chatStore.connectStatus !== CONNECT_STATUS.PENDING) {
      if (chatWsService.provider.io) chatWsService.destroy();
      chatStore.setConnectStatus(CONNECT_STATUS.PENDING);
    }
  };

  /**
   * 開啟視窗
   */
  const open = async () => {
    chatStore.open();

    /** 已有連線 */
    if (chatStore.connectStatus === CONNECT_STATUS.SUCCESS) return;

    /** 登入聊天室 */
    const res = await chatStore.login();
    if (res.code !== 1) {
      sendFeedbackMessage(chatMessages.t("connect.failed"));
      return;
    }
    const { account, chatId } = res.data;

    /** 開始處理連線 */
    chatStore.setConnectStatus(CONNECT_STATUS.PROGRESSING);
    chatWsService.connect(
      appStore.chatUrl,
      { chatId, account, lang: appStore.locale },
      {
        onOpen() {
          /** 連線後自動加入 */
          chatWsService.join();
        },
        async onJoin(payload) {
          if (payload.status === "success") {
            /** 撈客服頭像跟名稱 */
            getBotInfo();

            /** 撈常見問題 */
            getQuestionCategories();

            /** 歷史訊息 */
            onHistoryLoad();

            /** 歡迎訊息 */
            onWelcomeMessagesSend();

            /** 標記連線狀態 */
            chatStore.setConnectStatus(CONNECT_STATUS.SUCCESS);
          } else {
            chatStore.setConnectStatus(CONNECT_STATUS.FAILED);
            sendFeedbackMessage(chatMessages.t("connect.failed"));
          }
        },
        onClose() {
          chatStore.setConnectStatus(CONNECT_STATUS.FAILED);
          sendFeedbackMessage(chatMessages.t("connect.close"));
        },
        onError() {
          chatStore.setConnectStatus(CONNECT_STATUS.FAILED);
          sendFeedbackMessage(chatMessages.t("connect.failed"));
        },
      }
    );

    /** 收到廣播的處理 */
    chatWsService.attachMessageEvent(async (event) => {
      const {
        hash_id: hashId,
        message,
        source,
        type,
        send_at,
        sender: sender_account,
        sender_nickname,
        sender_avatar,
        lang,
      } = event;
      let currentMessage = message;
      if (type === MESSAGE_TYPE.TEXT && lang !== appStore.locale) {
        /** 只有文字訊息需要翻譯 */
        const response = await chatStore.translate({
          messages: [message],
        });
        /** 寫入翻譯後訊息 */
        currentMessage = response[0] ?? message;
      }
      chatStore.appendToMessages({
        type,
        source,
        status: MESSAGE_STATUS.SUCCESS,
        hashId,
        message: currentMessage,
        sender: {
          account: sender_account,
          nickname: sender_nickname,
          avatar: sender_avatar,
        },
        time: subHours(new Date(send_at), 8),
      });
    });

    /** 收到 response 的處理 */
    chatWsService.attachResponseEvent((response) => {
      const { hash_id: hashId, status } = response;
      stopMessageRace({
        hashId,
      });
      if (status === "success") {
        chatStore.updateMessageStatus({
          hashId: hashId,
          status: MESSAGE_STATUS.SUCCESS,
        });
      } else {
        chatStore.updateMessageStatus({
          hashId: hashId,
          status: MESSAGE_STATUS.FAILED,
        });
      }
    });
  };

  const stopMessageRace = (payload) => {
    const targetIdx = findIndex(
      (message) => message.hashId === payload.hashId,
      chatStore.messages
    );
    if (targetIdx > -1) chatStore.messages[targetIdx].timeoutRace?.();
  };

  const _send = ({ type, message }) => {
    const hashId = chatWsService.send({
      type,
      message,
      source: MESSAGE_SOURCE.USER,
    });

    /**
     * 建立競賽
     * 10 秒內沒有收到回傳就當作發送失敗
     */
    const timeoutRace = () => {
      const timer = setTimeout(() => {
        chatStore.updateMessageStatus({
          hashId,
          status: MESSAGE_STATUS.FAILED,
        });
      }, 10000);
      return () => {
        clearTimeout(timer);
      };
    };
    chatStore.appendToMessages({
      type,
      source: MESSAGE_SOURCE.USER,
      status: MESSAGE_STATUS.PROGRESSING,
      hashId,
      message,
      time: Date.now(),
      timeoutRace: timeoutRace(),
      sender: {
        account: chatWsService.account,
      },
    });

    return hashId;
  };

  /**
   * 發送訊息
   */
  const sendTextMessage = (message) => {
    return _send({
      type: MESSAGE_TYPE.TEXT,
      message,
    });
  };

  /**
   * 發送客服訊息
   */
  const sendBotMessage = (message) => {
    const hashId = chatWsService.send({
      type: MESSAGE_TYPE.TEXT,
      message,
      source: MESSAGE_SOURCE.BOT,
    });
    chatStore.appendToMessages({
      type: MESSAGE_TYPE.TEXT,
      source: MESSAGE_SOURCE.BOT,
      status: MESSAGE_STATUS.PROGRESSING,
      hashId,
      message,
      time: Date.now(),
      sender: {
        account: chatWsService.account,
      },
    });
  };

  /**
   * 寫入 feedback 訊息
   */
  const sendFeedbackMessage = (message) => {
    chatStore.appendToMessages({
      type: MESSAGE_TYPE.FEEDBACK,
      source: MESSAGE_SOURCE.SYSTEM,
      status: MESSAGE_STATUS.SUCCESS,
      message,
      time: Date.now(),
      sender: {
        account: chatWsService.account,
      },
    });
  };

  /**
   * 檔案上傳
   */
  const onFileUpload = async (file) => {
    const { size, type } = file;
    const [mimeType] = type.split("/");
    switch (mimeType) {
      case "image":
        // 限制 10 MB
        if (size > 10485760) {
          sendFeedbackMessage(errorMessages.t("chat.image.-4"));
          return;
        }
        /** 上傳前壓縮 */
        sendFileUpload(await compressImage(file));
        break;
      case "video":
        // 限制 50 MB
        if (size > 52428800) {
          sendFeedbackMessage(errorMessages.t("chat.video.-3"));
          return;
        }
        sendFileUpload(file);
        break;
      default:
        sendFeedbackMessage(chatMessages.t("not.support.ext"));
        return;
    }
  };

  const sendFileUpload = async (file) => {
    const [mimeType] = file.type.split("/");
    const hashId = chatWsService.generateHashId();
    const messageType =
      mimeType === "image" ? MESSAGE_TYPE.IMAGE : MESSAGE_TYPE.MEDIA;

    chatStore.appendToMessages({
      type: messageType,
      source: MESSAGE_SOURCE.USER,
      status: MESSAGE_STATUS.PROGRESSING,
      hashId,
      message: file,
      time: Date.now(),
      sender: {
        account: chatWsService.account,
      },
    });

    const response = await chatStore.uploadFile({
      mimeType,
      file,
    });

    if (response.code === 1) {
      chatStore.removeMessage({
        hashId,
      });
      /** 將網址當作訊息發送 */
      _send({
        type: messageType,
        message: response.data.url,
      });
    } else {
      chatStore.updateMessageStatus({
        hashId,
        status: MESSAGE_STATUS.UPLOAD_FAILED,
      });

      if (response.code < -1) {
        sendFeedbackMessage(
          errorMessages.t(`chat.${mimeType}.${response.code}`)
        );
      }
    }
  };

  /**
   * 重新發送
   */
  const onMessageRetry = (payload) => {
    /** 刪除 */
    chatStore.removeMessage({ hashId: payload.hashId });

    /** 重發 */
    switch (payload.status) {
      case MESSAGE_STATUS.PROGRESSING:
      case MESSAGE_STATUS.SUCCESS:
        break;
      case MESSAGE_STATUS.UPLOAD_FAILED:
        sendFileUpload(payload.message);
        break;
      default:
        _send({
          type: payload.type,
          message: payload.message,
        });
        break;
    }
  };

  /**
   * 移除訊息
   */
  const onMessageRemove = (payload) => {
    chatStore.removeMessage({ hashId: payload.hashId });
  };

  /**
   * 開啟表情
   */
  const onEmojiOpen = async ({ component, onSelected }) => {
    await popupWorkflow.bottomSheet({
      component,
      props: {
        onSelected,
      },
      showCancelButton: false,
      BackdropStyle: "rgba(0, 0, 0, 0)",
    });
  };

  /**
   * 聊天場景的問題分類點擊事件
   */
  const onCategoriesClick = async (cateId) => {
    const cateTarget = find((cate) => cate.id === cateId, chatStore.categories);
    if (!cateTarget) return;

    const cateHashId = sendTextMessage(cateTarget.name);
    const [, status] = await Promise.all([
      getQuestionItems({ categoryId: cateId }),
      new Promise((resolve) => {
        const subject = chatWsService.attachResponseEvent((response) => {
          const { hash_id: hashId, status } = response;
          if (cateHashId === hashId) {
            /** 收到分類訊息就切斷這個監聽 */
            subject.detach();
            resolve(status);
          }
        });
      }),
    ]);
    if (status !== "success") return;

    const items = chatStore.items[cateId];
    if (items.length > 0) {
      /** 給後端紀錄歷史，不給點擊 */
      const hashId = chatWsService.send({
        type: MESSAGE_TYPE.LIST,
        message: JSON.stringify(pluck("title", items)),
        source: MESSAGE_SOURCE.BOT,
      });

      /** 呈現在前台可以點擊 */
      chatStore.appendToMessages({
        type: MESSAGE_TYPE.LISTFN,
        source: MESSAGE_SOURCE.BOT,
        status: MESSAGE_STATUS.SUCCESS,
        hashId,
        message: JSON.stringify(project(["title", "content"], items)),
        time: Date.now(),
        sender: {
          account: chatWsService.account,
        },
      });
    } else {
      sendBotMessage(chatMessages.t("answer.empty"));
    }
  };

  /**
   * 聊天場景的問題項目點擊事件
   */
  const onListItemClick = async (item) => {
    const itemHashId = sendTextMessage(item.title);
    const subject = chatWsService.attachResponseEvent((response) => {
      const { hash_id: hashId, status } = response;
      if (itemHashId === hashId) {
        /** 收到標題的訊息就切斷這個監聽 */
        subject.detach();
        if (status === "success") sendBotMessage(item.content);
      }
    });
  };

  /**
   * 拿 chat api /ws 網址
   */
  const getServiceUrl = createGetServiceUrlPassport();

  /**
   * 取客服頭像
   */
  const getBotInfo = createGetChatBotInfoPassport();

  /**
   * 取歡迎訊息
   */
  const getWelcomeMessages = createGetWelcomeMessagesPassport();

  /**
   * 歡迎訊息發送行為
   */
  const onWelcomeMessagesSend = async () => {
    const messages = await getWelcomeMessages();
    for (let message of messages) {
      sendBotMessage(message);
      await new Promise((resolve) => {
        setTimeout(resolve, 300);
      });
    }
  };

  /**
   * 拿 QA 分類
   */
  const getQuestionCategories = createGetQuestionCategoriesPassport();

  /**
   * 拿分類底下的問題集
   */
  const getQuestionItems = createGetQuestionItemsPassport();

  /**
   * 載入歷史訊息
   */
  const getHistoryMessages = createGetHistoryMessagesPassport();

  /**
   * 加載歷史訊息行為
   */
  const onHistoryLoad = async () => {
    if (authStore.isLogin) {
      return getHistoryMessages();
    }
    return { data: [] };
  };

  /**
   * 初始化行為
   */
  const initial = () => {
    /** 建立監聽 */
    listenerWorkflow.registerLoggedIn(() => {
      chatStore.clear();
      if (chatStore.connectStatus !== CONNECT_STATUS.PENDING) {
        if (chatWsService.provider.io) chatWsService.destroy();
        chatStore.setConnectStatus(CONNECT_STATUS.PENDING);
      }
    });

    listenerWorkflow.registerLocale(() => {
      chatStore.clearQuestions();
    });
  };

  return {
    initial,
    excute,
    open,
    close,
    zoomOut,
    sendTextMessage,
    sendFeedbackMessage,
    sendBotMessage,
    getQuestionCategories,
    onHistoryLoad,
    onEmojiOpen,
    onFileUpload,
    onMessageRetry,
    onMessageRemove,
    onCategoriesClick,
    onListItemClick,
  };
});
