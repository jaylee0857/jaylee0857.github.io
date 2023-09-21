<template>
  <div class="giveaway__content__reciprocal" v-show="!isEmptyReciprocal">
    <div
      class="giveaway__content__reciprocal__icon"
      v-if="reciprocal !== t('pages.withdraw.prize.title')"
    ></div>
    <div class="giveaway__content__reciprocal__text"></div>
  </div>
  <img :src="isOpen ? chestOpen : chest" class="w-[16rem] h-[8rem]" />
  <div
    v-show="btnText"
    class="giveaway__content__btn"
    :class="[
      `giveaway__content__btn-${locale}`,
      { 'giveaway__content__btn--open': isOpen },
    ]"
  >
    <div
      class="giveaway__content__btn__content"
      :class="[
        `giveaway__content__btn__content-${locale}`,
        { 'giveaway__content__btn__content--open': isOpen },
      ]"
    ></div>
  </div>
  <div class="giveaway__content__caption">
    <div class="full"></div>
  </div>
</template>

<script setup>
import { onMounted, inject, computed } from "vue";
import { isEmpty } from "ramda";
import { useI18nService } from "@/services/i18n-service";
import chest from "@/assets/images/withdraw/img_chest_box.png";
import chestOpen from "@/assets/images/withdraw/img_chest_box_open.png";

const $ = inject("$jQuery");
const { t, locale } = useI18nService();

const props = defineProps({
  btnText: String,
  caption: String,
  reciprocal: String,
  isOpen: {
    type: Boolean,
    default: false,
  },
});
const isEmptyReciprocal = computed(() => isEmpty(props?.reciprocal ?? ""));
const settingString = () => {
  $(".giveaway__content__btn div").html(props.btnText);
  $(".giveaway__content__caption div").html(props.caption);
  if (!isEmptyReciprocal.value)
    $(".giveaway__content__reciprocal__text").html(props.reciprocal);
  const marginPx = $(".giveaway__content__btn").height() / 2;
  $(".giveaway__actions").css("margin-top", `${marginPx}px`);
};

onMounted(async () => {
  settingString();
});
</script>

<style lang="scss" scoped>
.giveaway__content__btn {
  // position: relative;
  margin: 0;
  width: 100%;
  top: 7.5rem;
  &--open {
    background-image: url("@/assets/images/withdraw/img_text_lightning_samll_bg.png");
  }
}
.giveaway__content__btn__content {
  &--open {
    align-items: center;
  }
}
</style>
