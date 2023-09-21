<template>
  <div class="payment__chest" @click="onBoxClick">
    <component
      :is="isUseAnimation ? 'canvas' : 'img'"
      ref="boxCtx"
      class="payment__chest__obj payment__chest__obj--hide"
      :class="{
        'payment__chest__obj--canvas': isUseAnimation,
        'payment__chest__obj--img': !isUseAnimation,
      }"
    />
  </div>
</template>
<script setup>
import { ref, onUnmounted, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useAppStore } from "@/store/app-store";
import { useWithdrawWorkflow } from "@/workflows/pages/withdraw-workflow";

/** helper */
import $ from "jquery";

const appStore = useAppStore();
const { animationSwitch: isUseAnimation } = storeToRefs(appStore);
const withdrawWorkflow = useWithdrawWorkflow();
const boxCtx = ref();

/** ================= Methods ===================== */
const onBoxClick = () => {
  withdrawWorkflow.onBoxClick(boxCtx);
};

/** ================= lifecycle ===================== */
onMounted(() => {
  if (isUseAnimation.value) {
    withdrawWorkflow.prepareBoxSource(boxCtx);
  } else {
    withdrawWorkflow.updateBoxStage(boxCtx);
  }
  $(boxCtx.value).removeClass("payment__chest__obj--hide");
});

onUnmounted(() => {
  withdrawWorkflow.cleanUpSources();
});
</script>
<style lang="scss" scoped>
@import "@/assets/scss/withdraw.scss";
</style>
