<template>
  <Flow :content="content">
    <div class="menu-list divide-y-2 divide-white">
      <div class="menu-list__item">
        {{ chatMessages("list.title") }}
      </div>
      <div
        v-for="item in menuList"
        :key="item"
        class="menu-list__item text-gray-400"
      >
        {{ item }}
      </div>
    </div>
  </Flow>
</template>

<script setup>
import { computed } from "vue";
import { useI18nService } from "@/services/i18n-service";

/** components */
import Flow from "./flow.vue";

const props = defineProps({
  content: Object,
});
const { scope } = useI18nService();
const { t: chatMessages } = scope("widgets.chat");
const menuList = computed(() => JSON.parse(props.content.message));
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
