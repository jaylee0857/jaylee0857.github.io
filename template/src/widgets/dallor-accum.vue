<template>
  <div class="w-dallor-accum">
    <div
      v-if="!!title"
      class="w-dallor-accum__title"
      :class="{ 'w-dallor-accum__title--required': required }"
    >
      {{ title }}
    </div>
    <ul class="w-dallor-accum__list">
      <li
        v-for="num in options"
        :key="num"
        class="w-dallor-accum__item"
        @click="onItemClick(num)"
      >
        <div class="w-dallor-accum__icon"></div>
        <div class="text-right" v-text-fit>
          {{ Number(num).toLocaleString() }}
        </div>
      </li>
    </ul>
  </div>
</template>
<script setup>
const props = defineProps({
  modelValue: {
    type: [Number, String],
    default: 0,
  },
  title: String,
  options: {
    type: Array,
    required: true,
  },
  required: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const onItemClick = (num) => {
  const origin = props.modelValue || 0;
  emit("update:modelValue", origin + num);
};
</script>
