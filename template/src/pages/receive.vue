<template>
  <div class="form">
    <div class="form__row">
      <div class="form__group">
        <div class="form__label">
          <span class="text-red-500">*</span>
        </div>
        <input
          ref="snRef"
          type="text"
          class="form__input"
          :placeholder="currentMessages('placeholder.sn')"
          v-model="sn"
        />
      </div>
      <div class="form__clear" v-show="sn" @click="onClear" />
      <div class="form__button" @click="onPaste">
        {{ currentMessages("button.paste") }}
      </div>
    </div>
  </div>
  <div class="footer">
    <div class="submit" @click="onSubmit" :disabled="sn.trim() === ''">
      {{ currentMessages("button.submit") }}
    </div>
    <div class="notice">
      <h2 class="notice__title">{{ currentMessages("notice") }}</h2>
      <div class="notice__box">
        <ol class="notice__list">
          <li class="notice__item">{{ currentMessages("notice.1") }}</li>
          <li class="notice__item">{{ currentMessages("notice.2") }}</li>
        </ol>
      </div>
    </div>
    <router-link to="/service" class="question">
      <div v-html="currentMessages('to.service')" />
    </router-link>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useI18nService } from "@/services/i18n-service";
import { useReceiveWorkflow } from "@/workflows/pages/receive-workflow";

defineOptions({
  layout: "layout-trade",
  title: "pages.account.link.receive",
});

const receiveWorkflow = useReceiveWorkflow();
const { scope } = useI18nService();
const { t: currentMessages } = scope("pages.receive");
const snRef = ref();
const sn = ref("");

const onPaste = async () => {
  try {
    const text = await navigator.clipboard.readText();
    sn.value = text;
  } catch (error) {
    snRef.value.focus();
    const result = document.execCommand("paste");
    sn.value = result;
  }
};

const onClear = () => {
  sn.value = "";
};

const onSubmit = async (e) => {
  const disabled = e.target.getAttribute("disabled");
  if (disabled === "true") return;
  const isFail = await receiveWorkflow.onSubmit({ sn: sn.value });
  if (!isFail) {
    onClear();
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/receive.scss";
</style>
