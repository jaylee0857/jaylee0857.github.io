<template>
  <BottomPicker
    :options="[options.years, options.months, options.dates]"
    :modelValue="state.selections"
    @update:modelValue="onChanged"
    @confirm="onConfirm"
    @cancel="onCancel"
  />
</template>
<script>
import { computed, reactive, watch } from "vue";
import { useI18nService } from "@/services/i18n-service";
/** components */
import BottomPicker from "@/widgets/bottom-picker";
/** helper */
import { times } from "ramda";
import { format, lastDayOfMonth, isValid, isAfter } from "date-fns";

export default {
  name: "DatePicker",
  components: { BottomPicker },
  props: {
    modelValue: String,
  },
  emits: ["update:modelValue", "confirm", "cancel"],
  setup(props, { emit }) {
    const { t } = useI18nService();

    /** 只要顧好自己要渲染的項目 */
    const options = reactive({
      // 最近 100 年
      years: computed(() => {
        const currentYear = +format(new Date(), "yyyy");
        return times((idx) => {
          const value = currentYear - (99 - idx);
          return {
            value,
            label: t("widgets.date-picker.text.year", { year: value }),
          };
        }, 100);
      }),
      // 固定月份
      months: times(
        (idx) => ({
          value: idx,
          label: t("widgets.date-picker.text.month", { month: idx + 1 }),
        }),
        12
      ),
      dates: computed(() => {
        // 計算每個月份的天數
        const selectionYear =
          state.selections[0] ?? +format(new Date(), "yyyy");
        const selectionMonth = state.selections[1] ?? +format(new Date(), "MM");

        const maxDay = +format(
          lastDayOfMonth(new Date(selectionYear, selectionMonth, 1, 0, 0, 0)),
          "dd"
        );
        return times(
          (idx) => ({
            value: idx + 1,
            label: t("widgets.date-picker.text.day", { day: idx + 1 }),
          }),
          maxDay
        );
      }),
    });

    const state = reactive({
      selections: [],
    });

    /**
     * 轉換日期格式
     */
    const updateModelValue = () => {
      const value = format(
        new Date(state.selections[0], state.selections[1], state.selections[2]),
        "yyyy-MM-dd"
      );
      emit("update:modelValue", value);
    };

    watch(
      () => props.modelValue,
      (date) => {
        const modelDate = new Date(date);
        if (isValid(modelDate)) {
          const selectionYear = +format(modelDate, "yyyy");
          const selectionMonth = +format(modelDate, "MM") - 1;
          const selectionDay = +format(modelDate, "dd");
          state.selections = [selectionYear, selectionMonth, selectionDay];
        } else {
          // 不合法的日期就設定為今天
          const selectionYear = +format(new Date(), "yyyy");
          const selectionMonth = +format(new Date(), "MM") - 1;
          const selectionDay = +format(new Date(), "dd");
          state.selections = [selectionYear, selectionMonth, selectionDay];
          // 寫入上層數值
          updateModelValue();
        }
      },
      { immediate: true }
    );

    const onChanged = (selections) => {
      const [nextYear, nextMonth, nextDay] = selections;
      const nextDate = new Date(nextYear, nextMonth, nextDay);
      const lastDay = lastDayOfMonth(new Date(nextYear, nextMonth, 1));
      // 下一筆變更的日期比當月最後一天還大
      if (isAfter(nextDate, lastDay)) {
        const selectionYear = +format(lastDay, "yyyy");
        const selectionMonth = +format(lastDay, "MM") - 1;
        const selectionDay = +format(lastDay, "dd");
        // 就選擇月份最後一天
        state.selections = [selectionYear, selectionMonth, selectionDay];
      } else {
        state.selections = [nextYear, nextMonth, nextDay];
      }

      // 寫入上層數值
      updateModelValue();
    };

    const onCancel = () => {
      emit("cancel");
    };

    const onConfirm = () => {
      emit("confirm");
    };

    return {
      t,
      state,
      options,
      onCancel,
      onConfirm,
      onChanged,
    };
  },
};
</script>
