<template>
  <div ref="currentRef">
    <slot></slot>
  </div>
</template>
<script setup>
import { ref, onUpdated, onMounted } from "vue";
const props = defineProps({
  source: Object,
});
const emit = defineEmits(["updated"]);

const currentRef = ref();

onMounted(() => {
  emit("updated", props.source.uuid, currentRef.value.offsetHeight);
});

onUpdated(() => {
  emit("updated", props.source.uuid, currentRef.value.offsetHeight);
});
</script>
