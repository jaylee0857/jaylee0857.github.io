<template>
  <div class="text whitespace-pre-line">{{ text }}</div>
</template>

<script setup>
const { text } = defineProps({ text: String });
</script>
