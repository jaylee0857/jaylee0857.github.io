<template>
  <div class="flex justify-center">
    <div
      class="inline px-8 py-4 rounded-full text-24 text-red-600 bg-[#fbf2f2]"
    >
      {{ content.message }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  content: Object,
});
</script>
