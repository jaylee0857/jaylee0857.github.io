<template>
  <div class="p-4 bg-white">
    <div class="h-60 grid grid-cols-8 gap-x-1 items-center overflow-x-scroll">
      <div
        class="p-4 h-[min-content] flex justify-center items-center text-[0.6rem] leading-[0.6rem] active:bg-gray-100"
        v-for="(item, index) in emojiList"
        :key="index"
        @click="onSelected"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ onSelected: Function });

const emojiList = [
  "😁",
  "🤗",
  "🤣",
  "😢",
  "😭",
  "😔",
  "😳",
  "🤔",
  "😡",
  "😍",
  "👀",
  "🍺",
  "👌",
  "👍",
  "🤝",
  "🙏",
];
</script>
