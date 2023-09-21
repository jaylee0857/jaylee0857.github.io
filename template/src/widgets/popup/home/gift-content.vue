<template>
  <div class="text" :class="{ 'low-height': isSetClass }">{{ text }}</div>
</template>

<script setup>
const { lang } = defineProps({ text: String, lang: String });
const isSetClass = ["ph", "en", "vn"].includes(lang);
console.log(lang, isSetClass);
</script>
