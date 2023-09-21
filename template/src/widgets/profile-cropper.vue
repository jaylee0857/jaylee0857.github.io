<template>
  <teleport to="body">
    <div class="fixed z-50 inset-0 flex flex-col">
      <div
        class="h-24 sticky top-0 bg-white flex justify-between items-center px-8"
      >
        <div class="w-12 h-12" @click="onClose">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            fill="currentColor"
            class="bi bi-x-lg"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"
            />
            <path
              fill-rule="evenodd"
              d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"
            />
          </svg>
        </div>
        <div class="w-16 h-16" @click="onSave">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            fill="currentColor"
            class="bi bi-check2"
            viewBox="0 0 16 16"
          >
            <path
              d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"
            />
          </svg>
        </div>
      </div>
      <div class="h-full bg-black flex justify-center items-center">
        <Cropper
          class="cropper"
          :src="path"
          image-restriction="fit-area"
          :stencil-component="CircleStencil"
          @change="onCropperChange"
        />
      </div>
    </div>
  </teleport>
</template>
<script>
import { ref } from "vue";
import { useI18nService } from "@/services/i18n-service";
import { Cropper, CircleStencil } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";

export default {
  name: "ProfileCropper",
  components: {
    Cropper,
  },
  props: {
    path: String,
  },
  emits: ["save", "close"],
  setup(props, { emit }) {
    const { t } = useI18nService();
    const data = ref();

    const onCropperChange = (res) => {
      data.value = res.canvas.toDataURL("image/jpeg", 0.1);
    };

    const onSave = () => {
      emit("save", data.value);
    };

    const onClose = () => {
      emit("close");
    };

    return {
      t,
      onCropperChange,
      onSave,
      onClose,
      CircleStencil,
    };
  },
};
</script>
