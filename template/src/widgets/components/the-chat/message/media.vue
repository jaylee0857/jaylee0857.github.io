<template>
  <Flow :content="content">
    <div
      class="-mx-8 -my-6 border rotate-0 rounded-sm overflow-hidden h-[200px]"
    >
      <div
        v-if="loadStatus === 'ERROR'"
        class="relative w-[200px] h-full flex justify-center items-center text-[1rem] text-gray-300 bg-gray-100"
        @click="onReload"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="1em"
          viewBox="0 0 512 512"
          class="fill-current"
        >
          <path
            d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-224a64 64 0 1 1 0 128 64 64 0 1 1 0-128zM100.7 132.7c6.2-6.2 16.4-6.2 22.6 0L160 169.4l36.7-36.7c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6L182.6 192l36.7 36.7c6.2 6.2 6.2 16.4 0 22.6s-16.4 6.2-22.6 0L160 214.6l-36.7 36.7c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6L137.4 192l-36.7-36.7c-6.2-6.2-6.2-16.4 0-22.6zm192 0c6.2-6.2 16.4-6.2 22.6 0L352 169.4l36.7-36.7c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6L374.6 192l36.7 36.7c6.2 6.2 6.2 16.4 0 22.6s-16.4 6.2-22.6 0L352 214.6l-36.7 36.7c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6L329.4 192l-36.7-36.7c-6.2-6.2-6.2-16.4 0-22.6z"
          />
        </svg>
      </div>
      <video
        v-else
        :src="src"
        preload="none"
        class="relative h-full object-cover bg-black"
        @load="onVideoLoad"
        @error="onVideoError"
        controls
      >
        Video format is not supported on your browser.
      </video>
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

const onVideoLoad = () => {
  loadStatus.value = "LOADED";
};

const onVideoError = () => {
  loadStatus.value = "ERROR";
};
</script>
