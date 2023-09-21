<template>
  <div
    class="swal2-popup swal2-modal swal2-confirm animate__animated animate__fadeInUp"
    :class="{ noLong: isNoLong }"
    tabindex="-1"
    style="display: grid"
  >
    <h2 class="swal2-title" id="swal2-title" style="display: block">
      <slot name="title">{{ t("app.dialog.system.title") }}</slot>
    </h2>
    <div
      class="swal2-html-container"
      id="swal2-html-container"
      style="display: block"
    >
      <slot name="content">content</slot>
    </div>
    <div class="swal2-actions" style="display: flex">
      <button
        type="button"
        class="swal2-cancel swal2-styled"
        style="display: inline-block"
        @click="onCancel"
        v-if="showCancel"
      >
        {{ t("button.cancel") }}</button
      ><button
        type="button"
        class="swal2-confirm swal2-styled"
        style="display: inline-block"
        @click="onConfirm"
      >
        {{ t("button.confirm") }}
      </button>
      <div class="swal2-loader"></div>
    </div>
    <div class="swal2-timer-progress-bar-container"></div>
  </div>
  <div class="modal-backdrop" @click="onCancel"></div>
</template>

<script>
import { useI18nService } from "@/services/i18n-service";
export default {
  emits: ["confirm", "cancel"],
  props: {
    confirmDisable: {
      type: Boolean,
      default: true,
    },
    showCancel: {
      type: Boolean,
      default: true,
    },
    isNoLong: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const { t } = useI18nService();
    const onConfirm = () => {
      if (!props.confirmDisable) return;
      emit("confirm");
    };
    const onCancel = () => {
      emit("cancel");
    };
    return {
      t,
      onCancel,
      onConfirm,
    };
  },
};
</script>

<style lang="scss" scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1040;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
}

.swal2-popup {
  position: fixed;
  top: 30%;
  left: 9%;
  transform: translate(-50%, -50%);
  z-index: 1041;
  &.noLong {
    top: 40%;
  }
}
</style>
