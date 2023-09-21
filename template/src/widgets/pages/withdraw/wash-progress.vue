<template>
  <div class="payment__progress__bar">
    <div
      class="payment__progress__bar__wrapper"
      :style="{
        width: `${record.percent}%`,
      }"
    >
      <div class="payment__progress__bar__wrapper__point"></div>
    </div>
  </div>
  <div class="payment__progress__text">
    <div
      class="payment__progress__text__item"
      v-for="item in progressbar"
      :key="item.percent"
      :class="{
        'payment__progress__text__item--achieve': item.isAchieve,
      }"
    >
      {{ item.percent }}%
    </div>
  </div>
</template>
<script setup>
import { computed } from "vue";

/** helper */
import { times } from "ramda";

const props = defineProps({
  record: Object,
});

/** 進度條 */
const progressbar = computed(() =>
  times(
    (idx) => ({
      percent: idx * 10,
      isAchieve: props.record.percent >= idx * 10,
    }),
    11
  )
);
</script>
<style lang="scss" scoped>
@import "@/assets/scss/withdraw.scss";
</style>
