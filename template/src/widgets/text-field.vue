<template>
  <div class="w-text-field" :class="{ 'w-text-field--inline': inline }">
    <div v-if="title" class="w-text-field__title">
      <span v-if="required" class="text-[red]">*</span>
      {{ title }}
    </div>
    <div class="w-text-field__field">
      <input
        ref="inputRef"
        type="text"
        class="w-text-field__input"
        :pattern="pattern"
        :value="modelValue"
        @input="onChangedHandler"
        :readonly="readonly"
      />
      <div
        v-show="modelValue === ''"
        class="w-text-field__placeholder"
        @click="onCoverClick"
        v-text-fit="{ minFontSize: 10 }"
      >
        {{ placeholder }}
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";

const props = defineProps({
  modelValue: String,
  title: String,
  placeholder: String,
  pattern: String,
  readonly: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  inline: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["update:modelValue"]);

const inputRef = ref();

const onChangedHandler = (e) => {
  emit("update:modelValue", e.currentTarget.value);
};
const onCoverClick = () => {
  if (props.readonly) return;
  inputRef.value.focus();
};
</script>
