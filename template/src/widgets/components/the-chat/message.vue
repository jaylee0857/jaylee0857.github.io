<template>
  <component :is="messagesComp" :content="content"></component>
</template>

<script setup>
import { computed } from "vue";

import { MESSAGE_TYPE } from "@/widgets/components/the-chat/_lib/const-defines";

/** compoents */
import Text from "./message/text.vue";
import Image from "./message/image.vue";
import Media from "./message/media.vue";
import List from "./message/list.vue";
import ListFn from "./message/list-fn.vue";
import Bulletin from "./message/bulletin.vue";

const props = defineProps({
  content: Object,
});

/** 訊息模板 */
const messagesComp = computed(() => {
  switch (props.content.type) {
    case MESSAGE_TYPE.IMAGE: // 圖片
      return Image;
    case MESSAGE_TYPE.MEDIA: // 影片
      return Media;
    case MESSAGE_TYPE.LIST: // 不可點擊選單
      return List;
    case MESSAGE_TYPE.LISTFN: // 可點擊選單
      return ListFn;
    case MESSAGE_TYPE.BULLETIN: // 系統訊息-公告
    case MESSAGE_TYPE.FEEDBACK: // 系統訊息-api response
      return Bulletin;
    default:
      return Text; // 預設使用文字樣式
  }
});
</script>
