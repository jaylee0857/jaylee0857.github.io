<template>
  <!-- 圖片 -->
  <div class="limitact__active__kv">
    <img :src="setting.attach" />
  </div>
  <!-- 標題 -->
  <div class="limitact__active__title">
    {{ setting.title }}
  </div>
  <!-- 內容 -->
  <div class="limitact__active__content">
    {{ setting.content }}
  </div>
  <!-- 不再提示 -->
  <label class="limitact__active__display" :class="{ on: againStatus === 0 }">
    <input
      type="checkbox"
      class="invisible"
      v-model="againStatus"
      :true-value="0"
      :false-value="1"
    />
    <span>
      <i></i>
    </span>
    <p>{{ t("pages.home.limit.noshow") }}</p>
  </label>
</template>

<script setup>
import { ref } from "vue";
import { useI18nService } from "@/services/i18n-service";

const { t } = useI18nService();
const props = defineProps({ setting: Object });
const againStatus = ref(props.setting.read_lock);
const onConfirmed = () => {
  return { status: againStatus.value };
};
defineExpose({
  onConfirmed,
});
</script>
