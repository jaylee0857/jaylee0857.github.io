<template>
  <ScrollPicker
    class="w-full"
    :options="[options.years, options.months, options.dates]"
    :modelValue="[model.year, model.month, model.date]"
    @update:modelValue="onChanged"
  />
</template>

<script setup>
import { computed, reactive, watch, watchEffect } from "vue";
import { useI18nService } from "@/services/i18n-service";
import ScrollPicker from "vue3-scroll-picker";
import { format, getYear, getDaysInMonth } from "date-fns";
import { times } from "ramda";

const { t } = useI18nService();

const props = defineProps({
  dateRange: {
    type: Array,
    default: () => [100], // year, month, day
  },
  value: {
    type: Date,
    required: true,
  },
});

const currentYear = +getYear(new Date());

/** 時間範圍 */
const options = reactive({
  years: computed(() => {
    return times((idx) => {
      const value = currentYear - (99 - idx);
      return {
        value,
        label: t("widgets.date-picker.text.year", { year: value }),
      };
    }, +props.dateRange[0]);
  }),
  months: times(
    (idx) => ({
      value: idx + 1,
      label: t("widgets.date-picker.text.month", { month: idx + 1 }),
    }),
    12
  ),
  dates: computed(() => {
    if (!model.year || !model.month) return [];
    const maxDay = getDaysInMonth(new Date(model.year, model.month - 1));
    return times(
      (idx) => ({
        value: idx + 1,
        label: t("widgets.date-picker.text.day", { day: idx + 1 }),
      }),
      maxDay
    );
  }),
});

const model = reactive({
  year: -1,
  month: -1,
  date: -1,
});

watchEffect(() => {
  [model.year, model.month, model.date] = format(props.value, "yyyy-MM-dd")
    .split("-")
    .map((item) => +item);
});

const onChanged = (e) => {
  [model.year, model.month, model.date] = e;
};

watch(
  () => options.dates.length,
  (newDates, oldDates) => {
    if (oldDates === newDates) return;
    /** 套件原來狀況: 31日改成2月時(只有28日)，日會跑到1
     * -> 改成維持最大值 */
    if (oldDates >= model.date && model.date > newDates) {
      model.date = newDates;
    }
  }
);

const onConfirmed = () => {
  return {
    value: new Date(`${model.year}-${model.month}-${model.date} 00:00:00`),
  };
};

defineExpose({
  onConfirmed,
});
</script>
