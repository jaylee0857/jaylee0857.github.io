<template>
  <div class="relative flex items-center justify-center text-36 h-24 w-full">
    <div
      v-if="goBackButton"
      class="go__back absolute left-3 top-6"
      @click="goBack"
    ></div>
    <div class="font-bold">
      <slot name="title">{{ title }}</slot>
    </div>
    <div class="absolute right-8 top-6">
      <slot name="actions" />
    </div>
  </div>
</template>
<script>
import { useRouter } from "vue-router";

export default {
  props: {
    title: {},
    goBackButton: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const router = useRouter();
    const goBack = () => {
      if (router.options.history.state.back) {
        router.back();
      } else {
        router.push({ name: "default-path" });
      }
    };

    return {
      goBack,
    };
  },
};
</script>
<style scoped>
/* .go__back {
  width: 0.45rem;
  height: 0.45rem;
  background-image: url("@/assets/images/trade/icon_back.svg");
  background-repeat: no-repeat;
  background-size: cover;
} */
.go__back {
  width: 0.45rem;
  height: 0.45rem;
  background-repeat: no-repeat;
  background-position: center;

  background-image: url("@/assets/images/trade/white_arrow_left.svg");
  background-size: 0.17rem;
}
</style>
