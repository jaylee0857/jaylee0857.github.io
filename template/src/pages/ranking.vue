<template>
  <div class="head">
    <div
      class="btn"
      v-for="(item, index) in form.date"
      :key="item.text"
      :class="{ 'btn--active': item.isActive }"
      @click="onSelect(index)"
      v-text-fit="{ fontSizeRange: 2 }"
    >
      {{ item.text }}
    </div>
  </div>
  <div class="tables w-full" :class="{ ph: locale === 'ph' }">
    <div class="th flex item-center bg-white">
      <div
        class="px-2 flex flex-col justify-center items-center custom-width remaining"
        v-text-fit="{ fontSizeRange: 2 }"
      >
        {{ t("pages.leaderboard.title.ranking") }}
      </div>
      <div
        class="px-2 flex flex-col justify-center items-center custom-width"
        v-text-fit="{ fontSizeRange: 2 }"
      >
        {{ t("pages.leaderboard.title.account") }}
      </div>
      <div
        class="px-2 flex flex-col justify-center items-center custom-width"
        v-text-fit="{ fontSizeRange: 2 }"
      >
        {{ t("pages.leaderboard.title.total_withdraw") }}
      </div>
      <div
        class="px-2 flex flex-col justify-center items-center custom-width"
        v-text-fit="{ fontSizeRange: 2 }"
      >
        {{ t("pages.leaderboard.title.last_deposit") }}
      </div>
      <div
        class="px-2 flex flex-col justify-center items-center custom-width"
        v-text-fit="{ fontSizeRange: 2 }"
      >
        {{ t("pages.leaderboard.title.last_withdraw") }}
      </div>
    </div>
    <div
      class="tables-list"
      :class="{ empty: isEmpty }"
      :data-text="t('pages.leaderboard.empty')"
    >
      <div
        class="td flex items-center bg-white"
        :class="`no${index + 1}`"
        v-for="(item, index) in form.list"
        :key="index"
      >
        <p class="flex justify-center items-center custom-width remaining">
          <span
            class="ranking-icon"
            :class="`no${index + 1}`"
            v-if="index < 3"
          ></span>
          <span v-else>{{ index + 1 }}</span>
        </p>
        <p class="flex justify-center items-center custom-width">
          {{ item.account }}
        </p>
        <p class="flex justify-center items-center custom-width">
          {{ item.total_withdraw ? parseInt(item.total_withdraw) : 0 }}
        </p>
        <p class="flex justify-center items-center custom-width">
          {{ item.last_deposit ? parseInt(item.last_deposit) : 0 }}
        </p>
        <p class="flex justify-center items-center custom-width">
          {{ item.last_withdraw ? parseInt(item.last_withdraw) : 0 }}
        </p>
      </div>
    </div>
    <div class="tables-self td flex items-center bg-white" v-if="!isEmpty">
      <p class="flex justify-center items-center custom-width remaining"></p>
      <p class="flex justify-center items-center custom-width">
        {{ form.self.account }}
      </p>
      <p class="flex justify-center items-center custom-width">
        {{ form.self.total_withdraw ? parseInt(form.self.total_withdraw) : 0 }}
      </p>
      <p class="flex justify-center items-center custom-width">
        {{ form.self.last_deposit ? parseInt(form.self.last_deposit) : 0 }}
      </p>
      <p class="flex justify-center items-center custom-width">
        {{ form.self.last_withdraw ? parseInt(form.self.last_withdraw) : 0 }}
      </p>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, computed } from "vue";
import { useStore } from "vuex";
import { useI18nService } from "@/services/i18n-service";
import { useAlertService } from "@/services/alert-service";
import { setString } from "@/tool";

export default {
  layout: "layout-trade",
  title: "pages.leaderboard.title",
  noScroll: true,
  setup() {
    const alertService = useAlertService();
    const { t, locale } = useI18nService();
    const store = useStore();
    const form = reactive({
      date: [
        { text: t("pages.leaderboard.tab.0"), isActive: false },
        { text: t("pages.leaderboard.tab.1"), isActive: false },
        { text: t("pages.leaderboard.tab.2"), isActive: false },
        { text: t("pages.leaderboard.tab.3"), isActive: false },
      ],
      selectDate: "",
      list: [],
      self: {},
      isOpen: false,
    });
    const isEmpty = computed(() => form.list.length === 0);

    const onSelect = async (i, onLoading = true) => {
      if (onLoading) alertService.showLoading();
      const timeOptions = [
        "this_week",
        "last_week",
        "this_month",
        "last_month",
      ];
      form.date.forEach((data, index) => {
        data.isActive = index === i;
      });
      if (timeOptions[i]) {
        await getList(timeOptions[i]);
      }
    };

    const getList = async (time) => {
      const res = await store.dispatch("app/read/ranking", time);
      if (res.code !== 1) {
        return alertService.alert({
          title: t("app.dialog.system.title2"),
          text: t("pages.bank.modify.empty"),
        });
      }

      alertService.close();
      form.list = res.data.map((data) => ({
        ...data,
        account: setString(data.account),
        last_deposit: ~~data.last_deposit,
        total_withdraw: ~~data.total_withdraw,
      }));

      form.self = { ...res.self };

      form.list.sort((a, b) => {
        const diff = b.total_withdraw - a.total_withdraw;
        return diff === 0 ? b.last_deposit - a.last_deposit : diff;
      });
    };

    onMounted(() => {
      onSelect(0, false);
      // 待實際資料
    });
    return {
      t,
      onSelect,
      form,
      locale,
      isEmpty,
    };
  },
};
</script>
<style lang="scss" scoped>
.head {
  display: flex;
  align-items: center;
  background: #fff;
  border-bottom: solid 1px #eceef1;
  height: 0.8rem;
  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 25%;
    height: 0.8rem;
    line-height: 0.95;
    padding: 0.15rem 0.05rem 0.1rem 0.05rem;
    font-size: 0.3rem;
    text-align: center;
    color: #9ea4b0;
    border-radius: 6px 6px 0 0;
    white-space: pre-wrap;
    border-bottom: 2px solid rgba($color: #000000, $alpha: 0);
    &--active {
      color: #000;
      border-bottom: 2px solid #b99772;
    }
  }
}
.tables {
  position: relative;
  font-size: 0.3rem;
  height: 100%;
  .th {
    padding: 0.4rem 0.3rem;
    max-height: 1.25rem;
    text-align: center;
  }
  &-list {
    overflow: scroll;
    // height: 74.8vh;
    // height: calc(var(--vh, 1vh) * 74.8);
    height: 77%;
    &.empty {
      position: relative;
      &::before {
        content: attr(data-text);
        position: absolute;
        top: 58%;
        left: 50%;
        color: #888888;
        text-align: center;
        transform: translate(-50%, -50%);
      }
      &::after {
        content: url("@/assets/images/ranking/empty_icon.png");
        position: absolute;
        top: 43%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
  .td {
    max-height: 54.59px;
    margin: 0.2rem 0;
    padding: 0.3rem;
    background: #fff no-repeat left / contain;
    &.no1 {
      background-image: url("@/assets/images/ranking/bg_01.png");
      background-color: #ffe1ce;
    }
    &.no2 {
      background-image: url("@/assets/images/ranking/bg_02.png");
      background-color: #faeedc;
    }
    &.no3 {
      background-image: url("@/assets/images/ranking/bg_03.png");
      background-color: #fdf6ec;
    }
  }
  .ranking-icon {
    display: block;
    width: 0.7rem;
    height: 0.5rem;
    // width: 0.75rem;
    // height: 0.6rem;
    background: no-repeat center / cover;
    &.no1 {
      background-image: url("@/assets/images/ranking/icon_01.png");
    }
    &.no2 {
      background-image: url("@/assets/images/ranking/icon_02.png");
    }
    &.no3 {
      background-image: url("@/assets/images/ranking/icon_03.png");
    }
  }
  &-self {
    position: relative;
    margin: 0 !important;
    color: #fff !important;
    border-top: 0.5px solid #000;
    background: linear-gradient(90deg, #db8243 6.53%, #a11dac 100%) #fff
      no-repeat left / contain !important;
    &::before {
      content: "";
      position: absolute;
      left: 0;
      height: 100%;
      width: 100%;
      background: url("@/assets/images/ranking/bg_self.png") no-repeat -1px -0.015rem/1rem
        103%;
    }
  }
}
.custom-width {
  width: 20.5%;
  font-size: 0.285rem;
  line-height: 1;
  &.remaining {
    width: 18%;
  }
}
// @import "@/assets/scss/recommend.scss"
</style>
