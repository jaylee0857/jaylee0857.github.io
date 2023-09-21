<template>
  <teleport to="body">
    <div
      v-if="chatStore.display"
      ref="bodyRef"
      class="fixed z-[1040] inset-0 w-full h-full flex justify-center items-center pt-20 overflow-hidden"
    >
      <div
        class="chat-inner flex flex-col bg-white w-full h-full rounded-tl rounded-tr"
      >
        <div class="flex justify-between items-center py-6 px-8">
          <div class="text-32">
            {{ chatMessages("title") }}
          </div>
          <div class="flex gap-8 items-center">
            <div @click="onZoomOut" class="text-40">
              <i class="fas fa-minus"></i>
            </div>
            <div @click="onClose" class="text-40">
              <i class="fas fa-times"></i>
            </div>
          </div>
        </div>
        <ChatList
          ref="chatListRef"
          class="bg-gray-50 px-4 py-4 flex-1"
          :messages="chatStore.messages"
        />
        <div
          v-if="chatStore.categories.length > 0"
          class="bg-transparent flex gap-6 px-4 py-4 overflow-x-auto whitespace-nowrap"
        >
          <div
            v-for="category in chatStore.categories"
            :key="category.id"
            class="flex justify-center items-center py-3 px-12 rounded-full bg-[#FBF2F2] text-28 text-[#80091D]"
            @click="onCategoryClick(category.id)"
          >
            {{ category.name }}
          </div>
        </div>
        <div
          ref="footerRef"
          class="px-8 py-4 h-30 flex justify-around items-stretch text-40 leading-none overflow-hidden rounded-t rounded-b-lg bg-[#80091D] mb-4 mx-2 text-white"
          :class="{
            '!rounded-none !m-0': isInputFocus,
            '!text-gray-400':
              chatStore.connectStatus !== CONNECT_STATUS.SUCCESS,
          }"
        >
          <input
            ref="fileInputEl"
            type="file"
            :accept="fileAccepts"
            @change="onFileChanged"
            hidden
          />
          <div class="flex items-end pb-3" @click="onFileIconClick">
            <i class="fas fa-plus"></i>
          </div>
          <div class="relative flex items-end flex-1 px-5">
            <textarea
              ref="inputRef"
              class="text-control w-full pl-6 pr-16 py-3 max-h-[3rem] flex-grow outline-none resize-none bg-transparent bg-[#510411] rounded text-30 leading-normal"
              :placeholder="inputPlacehodler"
              rows="1"
              @focus="onFocus"
              @blur="onBlur"
              @input="onRowsCompute"
              :disabled="chatStore.connectStatus !== CONNECT_STATUS.SUCCESS"
              v-model="inputValue"
              autofocus="autofocus"
            />
            <div class="absolute right-10 bottom-3" @click.stop="onEmojiOpen">
              <i class="far fa-smile"></i>
            </div>
          </div>
          <div class="flex items-end pb-3" @click="onSubmit">
            <i class="fas fa-paper-plane"></i>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, watch, computed, nextTick } from "vue";
import { useI18nService } from "@/services/i18n-service";
import { useChatStore } from "@/store/chat-store";
import { usePopupStore } from "@/store/popup-store";
import { useChatWorkflow } from "@/workflows/chat-workflow";
import { usePopupWorkflow } from "@/workflows/common/popup-workflow";

/** components */
import Emoji from "@/widgets/components/the-chat/emoji";
import ChatList from "@/widgets/components/the-chat/chat-list";

/** helper */
import gsap from "gsap";
import $ from "jquery";
import { CONNECT_STATUS, mimeMap } from "@/widgets/components/the-chat/_lib";
import { uniq, values } from "ramda";

const { t: rootMessages, scope } = useI18nService();
const { t: chatMessages } = scope("widgets.chat");
const chatStore = useChatStore();
const popupStore = usePopupStore();
const chatWorkflow = useChatWorkflow();
const popupWorkflow = usePopupWorkflow();

const chatListRef = ref();
const bodyRef = ref();
const footerRef = ref();
const inputRef = ref();
const fileInputEl = ref();
const isInputFocus = ref(false);
const inputValue = ref("");

const inputPlacehodler = computed(() => {
  switch (chatStore.connectStatus) {
    case CONNECT_STATUS.PENDING:
      return chatMessages("connect.status.PENDING");
    case CONNECT_STATUS.PROGRESSING:
      return chatMessages("connect.status.PROGRESSING");
    case CONNECT_STATUS.SUCCESS:
      return chatMessages("connect.status.SUCCESS");
    case CONNECT_STATUS.FAILED:
      return chatMessages("connect.status.FAILED");
  }
});

/**
 * ===================================================
 * 常見問題
 * ===================================================
 */
const onCategoryClick = (categoryId) => {
  if (chatStore.connectStatus !== CONNECT_STATUS.SUCCESS) return;
  chatListRef.value.setSrcollAtBottom();
  chatWorkflow.onCategoriesClick(categoryId);
};

/**
 * ===================================================
 * 檔案上傳
 * ===================================================
 */
const fileAccepts = uniq(values(mimeMap)).toString();
const onFileIconClick = () => {
  if (chatStore.connectStatus !== CONNECT_STATUS.SUCCESS) return;
  fileInputEl.value.click();
};
const onFileChanged = (e) => {
  const file = e.target.files[0];
  chatWorkflow.onFileUpload(file);
  e.target.value = "";
};

/**
 * ===================================================
 * 輸入框
 * ===================================================
 */
const onRowsCompute = () => {
  /** 行數減少時，須先執行auto，讓scrollHeight恢復正常 */
  inputRef.value.style.height = "auto";
  /** 增加高度使達到最大高度前不出現滾動 */
  inputRef.value.style.height = inputRef.value.scrollHeight + "px";
};
let unlockScreenScroll;
const lockScreenScroll = () => {
  const onWindowPreventEvent = function (e) {
    e.preventDefault();
    return false;
  };
  window.addEventListener("touchmove", onWindowPreventEvent, {
    passive: false, //為 true 的話調用 preventDefault 會失效
    capture: false, //為 false 會使用 bubbling，從內而外的流程
  });
  window.addEventListener("scroll", onWindowPreventEvent, {
    passive: false, //為 true 的話調用 preventDefault 會失效
    capture: false, //為 false 會使用 bubbling，從內而外的流程
  });

  return () => {
    window.removeEventListener("touchmove", onWindowPreventEvent);
    window.removeEventListener("scroll", onWindowPreventEvent);
  };
};
const onFocus = () => {
  isInputFocus.value = true;
  unlockScreenScroll = lockScreenScroll();
};
const onBlur = () => {
  isInputFocus.value = false;
  unlockScreenScroll?.();
};

/**
 * ===================================================
 * 視窗元件控制項
 * ===================================================
 */
const serviceIconPosition = {
  left: "21vw", // 中心點 往右 21vw
  top: "calc(50vh - 0.75rem)", // 中心點 - 50vh + 導覽列一半高
};
/** 縮小 */
const onZoomOut = async () => {
  await gsap.to(bodyRef.value, {
    duration: 0.3,
    scale: 0,
    ...serviceIconPosition,
  });
  chatWorkflow.zoomOut();
};
/** 關閉 */
const onClose = async () => {
  if (inputValue.value.trim()) {
    const { isDismissed } = await popupWorkflow.confirm({
      title: rootMessages("app.dialog.system.title"),
      text: chatMessages("not.submit.yet"),
    });
    if (isDismissed) return;
  }
  // eslint-disable-next-line require-atomic-updates
  inputValue.value = "";
  await gsap.to(bodyRef.value, {
    duration: 0.3,
    opacity: 0,
  });
  chatWorkflow.close();
};

/** 監聽開關，觸發開啟動畫 */
watch(
  () => chatStore.display,
  (display) => {
    if (!display) {
      $("body, #app").removeClass("overflow-hidden");
      return;
    }
    $("body, #app").addClass("overflow-hidden");
    window.scrollTo(0, 0);

    /** 渲染後再跑動畫 */
    nextTick(() => {
      gsap.set(bodyRef.value, {
        scale: 0,
        ...serviceIconPosition,
      });
      gsap.to(bodyRef.value, {
        duration: 0.3,
        scale: 1,
        left: "0px",
        top: "0px",
      });
      chatListRef.value.srcollToBottom();
    });
  }
);

/**
 * ===================================================
 * 表情
 * ===================================================
 */
const onEmojiOpen = async () => {
  if (chatStore.connectStatus !== CONNECT_STATUS.SUCCESS) return;

  let newSelectionStart = inputRef.value.selectionStart;
  const onSelected = (e) => {
    /** 從原本游標位置插入 */
    inputValue.value =
      inputValue.value.slice(0, newSelectionStart) +
      e.target.textContent +
      inputValue.value.slice(newSelectionStart);

    newSelectionStart += e.target.textContent.length;

    onRowsCompute();
  };

  await chatWorkflow.onEmojiOpen({ component: Emoji, onSelected });

  /** 回到目前的游標位置 */
  // inputRef.value.focus();
  // inputRef.value.setSelectionRange(newSelectionStart, newSelectionStart);
};
/** 監聽 BottomSheet 開關，觸發動畫 */
let ani;
watch(
  () => popupStore.$display,
  (display) => {
    if (!chatStore.display) return;
    if (display) {
      switch (popupStore.payload.type) {
        case "BottomSheet":
          ani = gsap.to(bodyRef.value, {
            duration: 0.3,
            height: `-=${$(".bottom__picker").height() - 3}px`, // Emoji component height
          });
          break;
      }
    } else {
      ani?.revert();
      ani = null;
    }
  }
);

/**
 * ===================================================
 * 送出訊息
 * ===================================================
 */
const onSubmit = () => {
  if (chatStore.connectStatus !== CONNECT_STATUS.SUCCESS) return;
  if (!inputValue.value.trim()) return;
  chatListRef.value.setSrcollAtBottom();
  chatWorkflow.sendTextMessage(inputValue.value);
  inputValue.value = "";
  inputRef.value.style.height = "auto";
};
</script>
<style lang="scss" scoped>
.text-control::placeholder {
  white-space: nowrap;
  overflow: hidden;
}

.chat-inner {
  --tw-shadow: 0 -10px 15px -3px rgba(0, 0, 0, 0.1),
    0 -4px 6px -2px rgba(0, 0, 0, 0.05);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
    var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
</style>
