<template>
  <VirtualList
    ref="virtualController"
    dataKey="uuid"
    :dataSources="messages"
    wrapClass="gap-2 flex flex-col"
    :topThreshold="30"
    :bottomThreshold="30"
    :estimateSize="50"
    :keeps="40"
    @totop="onTop"
    @touchmove="onTouchmove"
  >
    <template v-slot="{ source: message }">
      <Message :content="message.payload" :display="message.display" />
    </template>
  </VirtualList>
</template>

<script setup>
import { ref, computed, nextTick, onUpdated, provide } from "vue";
import { useI18nService } from "@/services/i18n-service";
import { useChatWorkflow } from "@/workflows/chat-workflow";
import { MESSAGE_STATUS } from "@/widgets/components/the-chat/_lib/const-defines";

/** components */
import Message from "@/widgets/components/the-chat/message";
import VirtualList from "@/widgets/virtual-list";

/** helper */
import { reduce, addIndex } from "ramda";
import {
  isSameMinute,
  isSameDay,
  format,
  isToday,
  isYesterday,
  isThisYear,
  isValid,
} from "date-fns";

const props = defineProps({
  messages: Array,
});

const { t: rootMessages } = useI18nService();
const chatWorkflow = useChatWorkflow();
const isFetching = ref(false);
const noMore = ref(false);
const virtualController = ref();
const scrollAtBottom = ref(true);

const dateLimitDisplay = (date) => {
  switch (true) {
    case !isValid(date):
      return "";
    case isToday(date):
      return rootMessages("widgets.chat.date.limit.today");
    case isYesterday(date):
      return rootMessages("widgets.chat.date.limit.yesterday");
    case !isThisYear(date):
      return format(date, "yyyy/MM/dd");
    default:
      return format(date, "MM/dd");
  }
};

const messages = computed(() =>
  addIndex(reduce)(
    (results, message, idx) => {
      /** 顯示訊息跨日標記 */
      let dateLimit = null;
      if (idx === 0) {
        dateLimit = dateLimitDisplay(new Date(message.time));
      } else if (idx > 0) {
        const previous = props.messages[idx - 1];
        if (!isSameDay(new Date(previous.time), new Date(message.time))) {
          dateLimit = dateLimitDisplay(new Date(message.time));
        }
      }

      /** 檢查需不需要顯示時間 */
      let time = true;
      if (idx < props.messages.length - 1) {
        const next = props.messages[idx + 1];
        if (
          next.source === message.source &&
          next.status === MESSAGE_STATUS.SUCCESS
        ) {
          time = !isSameMinute(new Date(next.time), new Date(message.time));
        }
      }

      /** 檢查需不需要顯示頭像 */
      let avatar = true;
      if (idx > 0) {
        const prev = props.messages[idx - 1];
        if (
          prev.source === message.source &&
          prev.status === MESSAGE_STATUS.SUCCESS
        ) {
          avatar = !isSameMinute(new Date(prev.time), new Date(message.time));
        }
      }

      return [
        ...results,
        {
          uuid: message.uuid,
          display: {
            dateLimit,
            time,
            avatar,
          },
          payload: message,
        },
      ];
    },
    [],
    props.messages
  )
);

const onTop = () => {
  if (noMore.value) return;
  if (isFetching.value) return;

  scrollAtBottom.value = false;
  const lastMessageUuid = messages.value[0].uuid;
  isFetching.value = true;

  /**
   * 這裡要注意撈取筆數，不能大於 VirtualList keeps 數量，不然畫面會不順暢
   */
  chatWorkflow.onHistoryLoad().then((response) => {
    if (response.data.length === 0) {
      noMore.value = true;
      return;
    }

    nextTick(() => {
      const newsUuids = [];
      for (let msg of messages.value) {
        if (msg.uuid === lastMessageUuid) {
          break;
        }
        newsUuids.push(msg.uuid);
      }
      /** 取得本次撈取的最新資料，重新定位 */
      const offset = newsUuids.reduce((previousValue, currentUuid) => {
        const previousSize =
          typeof previousValue === "string" && previousValue !== 0
            ? virtualController.value.getSize(previousValue)
            : previousValue;
        return previousSize + virtualController.value.getSize(currentUuid);
      }, 0);
      virtualController.value.scrollToOffset(offset);
      isFetching.value = false;
    });
  });
};

const onTouchmove = () => {
  scrollAtBottom.value = virtualController.value.isScrollAtBottom();
};

const setSrcollAtBottom = () => {
  scrollAtBottom.value = true;
};

const srcollToBottom = () => {
  virtualController.value.scrollToBottom();
};

onUpdated(() => {
  if (scrollAtBottom.value) srcollToBottom();
});

provide("setSrcollAtBottom", setSrcollAtBottom);

defineExpose({
  setSrcollAtBottom,
  srcollToBottom,
});
</script>
