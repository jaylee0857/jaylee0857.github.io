<template>
  <ScrollPicker class="w-full" :options="options" v-model="modelValue" />
</template>

<script setup>
import { ref } from "vue";
import ScrollPicker from "vue3-scroll-picker";

const props = defineProps({ options: Array, value: Array });

const modelValue = ref(props.value);

const onConfirmed = () => {
  return { value: modelValue.value };
};

defineExpose({
  onConfirmed,
});
</script>
