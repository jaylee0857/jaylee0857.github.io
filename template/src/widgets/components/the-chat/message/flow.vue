<template>
  <div v-if="display.dateLimit" class="flex justify-center items-center my-2">
    <div class="text-20 bg-[#F1E3E3] rounded-full px-6 py-2 text-[#7E6060]">
      {{ display.dateLimit }}
    </div>
  </div>
  <div
    class="flow"
    :class="{
      'flow--left': content.source === MESSAGE_SOURCE.BOT,
      'flow--right': content.source === MESSAGE_SOURCE.USER,
      'mb-2': display.time,
    }"
  >
    <div
      v-if="
        content.source === MESSAGE_SOURCE.USER &&
        [MESSAGE_STATUS.UPLOAD_FAILED, MESSAGE_STATUS.FAILED].includes(
          content.status
        )
      "
      class="flow-action"
    >
      <div class="flow-action__item flow-action__item--redo" @click="onResend">
        <i class="fas fa-redo"></i>
      </div>
      <div class="flow-action__item" @click="onDelete">
        <i class="fas fa-times"></i>
      </div>
    </div>
    <div class="flow-slot">
      <div v-if="display.avatar" class="flow-cover">
        <img
          v-if="botAvatar"
          class="flow-cover__img"
          :src="botAvatar"
          @error="onAvatarReadFailed"
        />
        <img
          v-else
          class="flow-cover__img"
          src="@/assets/images/account/img_card_photo.png"
        />
        <div class="flow-cover__initial">
          <i class="fas fa-robot"></i>
        </div>
      </div>
      <div v-else class="flow-cover flow-cover--placeholder">&nbsp;</div>
      <div class="flex flex-col">
        <div v-if="display.avatar" class="flow-sender">
          {{ botName }}
        </div>
        <div
          class="flow-message"
          :class="{
            'flow-message--progressing':
              content.source === MESSAGE_SOURCE.USER &&
              content.status === MESSAGE_STATUS.PROGRESSING,
            'flow-message--transparent': [
              MESSAGE_TYPE.IMAGE,
              MESSAGE_TYPE.MEDIA,
            ].includes(content.type),
          }"
        >
          <slot v-bind="content"></slot>
        </div>
        <div
          v-if="display.time && content.status === MESSAGE_STATUS.SUCCESS"
          class="flow-time"
        >
          {{ time }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from "vue";
import { useChatStore } from "@/store/chat-store";
import { useAppStore } from "@/store/app-store";
import { useChatWorkflow } from "@/workflows/chat-workflow";
import {
  MESSAGE_SOURCE,
  MESSAGE_STATUS,
  MESSAGE_TYPE,
} from "@/widgets/components/the-chat/_lib/const-defines";

/** assets */
import avatarDefault from "@/assets/images/account/img_card_photo.png";

/** helper */
import { format } from "date-fns";
import tw from "date-fns/locale/zh-TW";
import en from "date-fns/locale/en-US";

const chatWorkflow = useChatWorkflow();
const appStore = useAppStore();
const chatStore = useChatStore();

const props = defineProps({
  content: Object,
  display: Object,
});
const time = computed(() =>
  format(new Date(props.content.time), "aa hh:mm", {
    locale: appStore.locale === "tw" ? tw : en,
  })
);
const botName = computed(() =>
  props.content.sender.nickname !== ""
    ? props.content.sender.nickname
    : chatStore.bot.name ?? "Vivi Service"
);
const botAvatar = computed(() => {
  if (props.content.sender.avatar) {
    return new URL(
      props.content.sender.avatar,
      import.meta.env.VITE_REMOTE_IMAGES
    ).href;
  }

  if (chatStore.bot.avatar) {
    return new URL(
      chatStore.bot.avatar,
      import.meta.env.VITE_REMOTE_IMAGES
      //
    ).href;
  }

  return null;
});

const onAvatarReadFailed = (e) => {
  switch (true) {
    /** 防呆: 連預設圖片也讀不到就隱藏 */
    case e.target.src.endsWith(avatarDefault):
      e.target.classList.add("not-found");
      break;

    case e.target.src.endsWith(chatStore.bot.avatar):
      e.target.src = avatarDefault;
      break;

    case e.target.src.endsWith(props.content.sender.avatar):
      e.target.src = new URL(
        chatStore.bot.avatar,
        import.meta.env.VITE_REMOTE_IMAGES
        //
      ).href;
      break;
  }
};
const onResend = () => {
  chatWorkflow.onMessageRetry(props.content);
};
const onDelete = () => {
  chatWorkflow.onMessageRemove({
    hashId: props.content.hashId,
  });
};
</script>

<style lang="scss" scoped>
.flow {
  @apply flex gap-4 items-end;
  width: 100%;

  &--left {
    justify-content: flex-start;
  }
  &--right {
    justify-content: flex-end;
  }

  &-action {
    @apply flex gap-4 items-center;
    font-size: 0.3rem;

    &__item {
      @apply flex justify-center items-center text-white rounded-full;
      opacity: 0.8;
      background-color: #a8a8a8;
      width: 0.6rem;
      height: 0.6rem;
      font-size: 0.32rem;

      &--redo {
        padding-right: 1px;
        padding-top: 1px;
      }
    }
  }

  &-time {
    @apply text-18;
    color: #7e6060;
    font-family: Inter;
    font-style: normal;
    font-weight: 400;
    line-height: 2;
  }

  &-slot {
    @apply gap-4;
    max-width: 70%;
    display: flex;
  }

  &-sender {
    @apply text-28;
    color: #000e08;
    font-weight: 500;
    line-height: 1.5;
    display: none;
  }

  &-message {
    @apply px-8 py-6 text-28 rounded whitespace-pre-wrap;
    color: #000e08;
    min-width: 1.5rem;

    &--progressing {
      opacity: 0.5;
    }

    &--transparent {
      border-radius: 0px !important;
      background: transparent !important;
    }
  }

  &-cover {
    position: relative;
    flex: 0 0 0.7rem;
    width: 0.7rem;
    height: 0.7rem;
    border: 1px solid #ccc;
    border-radius: 100%;
    overflow: hidden;
    display: none;
    transform: rotate(0);
    color: #aaaaaa;

    &__img {
      position: relative;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: 2;
      background-color: transparent;

      &.not-found {
        display: none;

        ~ .flow-cover__initial {
          display: flex !important;
        }
      }
    }

    &__initial {
      @apply absolute inset-0 z-0 justify-center items-center text-40;
      display: none;
    }

    &--placeholder {
      border: none;
    }
  }
}
.flow--left {
  .flow-message {
    @apply rounded-tl-none;
    background: #fbf2f2;
  }
  .flow-time {
    text-align: right;
  }
  .flow-cover {
    display: block !important;
  }
  .flow-sender {
    display: block !important;
  }
}

.flow--right {
  .flow-message {
    @apply rounded-tr-none;
    background: #80091d;
    color: #ffffff;

    &--progressing {
      color: #bbb;
    }
  }
  .flow-time {
    text-align: left;
  }
}
</style>
