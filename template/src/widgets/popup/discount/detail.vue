<template>
  <div class="discount-detail flex flex-col h-full">
    <div class="discount-detail-img flex-none">
      <img :src="image" style="width: 100%" />
    </div>
    <div
      class="discount-detail-content flex-1 overflow-x-hidden overflow-y-auto placeholder"
    >
      <div class="discount-detail-date flex items-center justify-center">
        <div class="icon-daily"></div>
        <p class="text-center text-own py-8">
          {{ setting.start }} {{ t("pages.activity.during") }}
          {{ setting.end }}
        </p>
      </div>
      <div
        class="discount-detail-info"
        :class="{ 'text-center': content.length < 30 }"
      >
        {{ content }}
      </div>
    </div>
    <div class="discount-detail-button flex-none p-5">
      <!-- 只有當為自動審核拒絕時才顯示 -->
      <p
        class="discount-detail-tip"
        v-if="setting.record.status === 'auto_away'"
      >
        <span>
          {{ t("pages.activity.auto_away") }} :
          {{ t("pages.activity.ineligible") }}
        </span>
      </p>
    </div>
  </div>
</template>
<script setup>
import { onMounted, onUnmounted } from "vue";
import { useI18nService } from "@/services/i18n-service";
import $ from "jquery";

const { t } = useI18nService();
const { allowConfirm, image, content, setting } = defineProps({
  allowConfirm: Boolean,
  image: String,
  content: String,
  setting: Object,
});

onMounted(() => {
  $("body").addClass("overflow-hidden");

  if (!allowConfirm) {
    $(".layout-trade.paging .footer-actions .confirm-button").addClass(
      "confirm-button--disabled"
    );
  }
});

onUnmounted(() => {
  $("body").removeClass("overflow-hidden");
});

const onConfirmed = async () => {
  if (!allowConfirm) return;
  return true;
};

defineExpose({
  onConfirmed,
});
</script>
<style lang="scss" scoped>
@import "@/assets/scss/discount.scss";
.discount-detail-info {
  padding: 0 0.5rem;
  white-space: pre-wrap;
  font-size: 0.3rem;
  line-height: 1.5;
}
.text-own {
  font-size: 0.3rem; /* 36px */
  line-height: 0.5rem; /* 40px */
}
.icon-daily {
  width: 0.28rem;
  height: 0.28rem;
  background: url("@/assets/images/discount/icon_daily.webp") no-repeat;
  background-size: contain;
  margin: 0 0.1rem;
}
</style>
