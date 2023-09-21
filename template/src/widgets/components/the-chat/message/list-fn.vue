<template>
  <Flow :content="content">
    <div class="menu-list divide-y-2 divide-white">
      <div class="menu-list__item">
        {{ chatMessages("list.title") }}
      </div>
      <div
        v-for="item in menuList"
        :key="item"
        class="menu-list__item text-[#80091D]"
        @click="answer(item)"
      >
        {{ item.title }}
      </div>
    </div>
  </Flow>
</template>

<script setup>
import { computed, inject } from "vue";
import { useI18nService } from "@/services/i18n-service";
import { useChatWorkflow } from "@/workflows/chat-workflow";

/** components */
import Flow from "./flow.vue";

const props = defineProps({
  content: Object,
});

const setSrcollAtBottom = inject("setSrcollAtBottom");
const { scope } = useI18nService();
const { t: chatMessages } = scope("widgets.chat");
const chatWorkflow = useChatWorkflow();
const menuList = computed(() => JSON.parse(props.content.message));

const answer = (item) => {
  setSrcollAtBottom();
  chatWorkflow.onListItemClick(item);
};
</script>

<style lang="scss" scoped>
.menu-list {
  @apply -mx-8;

  &__item {
    @apply px-8 py-4;

    &:first-child {
      @apply pt-0;
    }

    &:last-child {
      @apply pb-0;
    }
  }
}
</style>
