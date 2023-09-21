<template>
  <Flow :content="content">
    <div
      class="-mx-8 -my-6 border rotate-0 rounded-sm overflow-hidden max-w-[200px] max-h-[200px]"
      :class="{
        'h-[200px]': loadStatus !== 'LOADED',
      }"
    >
      <div
        v-if="loadStatus === 'ERROR'"
        class="relative w-[200px] h-full flex justify-center items-center text-[1rem] text-gray-300 bg-gray-100"
        @click="onReload"
      >
        <i class="fas fa-image"></i>
      </div>
      <img
        v-else
        :src="src"
        class="relative w-full h-full object-contain"
        loading="lazy"
        @load="onImageLoad"
        @error="onImageError"
      />
    </div>
  </Flow>
</template>

<script setup>
import { computed, ref } from "vue";
import Flow from "./flow.vue";
import { getLocalUrl } from "@/widgets/components/the-chat/_lib/file-helpers";

const props = defineProps({
  content: Object,
});
const loadStatus = ref("PENDING");
const loadHash = ref("");

const src = computed(() => {
  if (props.content.message instanceof File)
    return getLocalUrl(props.content.message);
  else return props.content.message + "?v=" + loadHash.value;
});

const onReload = () => {
  loadHash.value = Date.now();
  loadStatus.value = "PENDING";
};

const onImageLoad = () => {
  loadStatus.value = "LOADED";
};

const onImageError = () => {
  loadStatus.value = "ERROR";
};
</script>
