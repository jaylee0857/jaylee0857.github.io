<template>
  <div class="discount flex flex-col">
    <div
      class="sticky top-0 left-0 w-full h-24 z-30 bg-gradient-to-r from-[#CF2323] to-[#980000]"
    >
      <the-header>
        <template v-slot:title>
          <div class="text-white font-normal">
            {{ activityMessages("title") }}
          </div>
        </template>
      </the-header>
    </div>
    <div class="tabs flex-1 h-full flex flex-col">
      <div
        class="sticky z-10 top-0 text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 flex-none bg-white tabs__bar-wrap overflow-scroll"
      >
        <div class="m-tab flex -mb-px tabs__bar text-gray">
          <template v-for="(item, index) in discounts.list" :key="index">
            <div
              class="flex-1 tabs__controls px-1 py-6 text-xl rounded-t-lg border-b-2 border-transparent text-gray-400 whitespace-nowrap"
              v-if="item.length > 0"
              style="padding: 0.2rem"
            >
              {{ activityMessages("tab.act_" + index) }}
            </div>
          </template>
        </div>
      </div>
      <!-- content -->
      <div class="tabs__content whitespace-nowrap flex-1">
        <template v-for="(item, index) in discounts.list" :key="index">
          <div
            class="tabs__section h-full w-full inline-block align-top font-sans overflow-x-hidden overflow-y-auto"
            v-if="item.length > 0"
          >
            <div
              v-if="
                (index === 1 &&
                  vip === 0 &&
                  (~~vipInfo.meta?.remaining_withdraw_amount ||
                    ~~vipInfo.meta?.remaining_withdraw_count)) ||
                (index === 2 && vipInfo.list[2]?.monthly_upgrade_count) ||
                (index === 3 && vipInfo.list[3]?.monthly_withdraw_top_rank)
              "
              class="pt-6 px-4"
            >
              <div :class="`hint-${index}`">
                <div
                  v-if="index === 1"
                  class="flex justify-center flex-col text-white"
                >
                  <div
                    class="mx-8 pl-32 pt-4 h-32 flex justify-center items-start flex-col space-y-2 text-28 overflow-scroll"
                    :class="locale !== 'tw' && 'pl-28'"
                    style="text-shadow: 0px 1px 4px rgba(0, 0, 0, 0.6)"
                  >
                    <div class="flex items-center">
                      <img
                        v-if="!~~vipInfo.meta?.remaining_withdraw_amount"
                        class="mr-2 w-[0.34rem] h-[0.34rem] rounded-full"
                        src="@/assets/images/discount/icon_check.png"
                      />
                      <img
                        v-else
                        class="mr-2 w-[0.34rem] h-[0.34rem] rounded-full"
                        src="@/assets/images/discount/icon_reject.png"
                      />
                      <span>
                        1.
                        {{
                          activityMessages("hint.1.1", {
                            num: Math.ceil(
                              vipInfo.list[1]?.upgrade_withdraw_amount
                            ),
                          })
                        }}
                      </span>
                    </div>
                    <div class="flex items-center">
                      <img
                        v-if="!~~vipInfo.meta?.remaining_withdraw_count"
                        class="mr-2 w-[0.34rem] h-[0.34rem] rounded-full"
                        src="@/assets/images/discount/icon_check.png"
                      />
                      <img
                        v-else
                        class="mr-2 w-[0.34rem] h-[0.34rem] rounded-full"
                        src="@/assets/images/discount/icon_reject.png"
                      />
                      <span>
                        2.
                        {{
                          activityMessages("hint.1.2", {
                            num: Math.ceil(
                              vipInfo.list[1]?.upgrade_withdraw_count
                            ),
                          })
                        }}
                      </span>
                    </div>
                  </div>
                  <div
                    class="mx-4 leading-[0.45rem] text-20 text-center font-light overflow-scroll"
                  >
                    {{ activityMessages("hint.1.3") }}
                    <span class="text-[#FBF7A4]">
                      {{ Math.ceil(vipInfo.meta?.remaining_withdraw_amount) }}
                    </span>
                    {{ activityMessages("hint.1.4") }}
                    <span class="text-[#FBF7A4]">
                      {{ Math.ceil(vipInfo.meta?.remaining_withdraw_count) }}
                    </span>
                    {{ activityMessages("hint.1.5") }}
                  </div>
                </div>
                <div
                  v-else-if="[2, 3].includes(index)"
                  class="flex justify-center items-center flex-col text-white text-28"
                  @click="onDetail(index === 2 ? 'bird' : 'snake')"
                >
                  <div
                    class="h-[1.72rem] flex items-center space-y-2 whitespace-pre-wrap"
                    :class="[
                      locale === 'tw'
                        ? 'mx-24 justify-center'
                        : 'pl-28 pr-8 pb-10 text-26 overflow-x-scroll overflow-y-hidden',
                      index === 2 && ['en', 'ph'].includes(locale)
                        ? 'pt-12'
                        : 'pt-4',
                      index === 3 && ['en', 'ph'].includes(locale) && 'pt-6',
                    ]"
                    style="text-shadow: 0px 1px 4px rgba(0, 0, 0, 0.6)"
                  >
                    {{
                      activityMessages(`hint.${index}`, {
                        num:
                          index === 2
                            ? vipInfo.list[2]?.monthly_upgrade_count
                            : vipInfo.list[3]?.monthly_withdraw_top_rank,
                      })
                    }}
                  </div>
                  <div
                    class="ml-auto -mt-12 mr-2 w-60 text-center leading-[0.45rem]"
                  >
                    {{ activityMessages("hint.detail") }}
                  </div>
                </div>
              </div>
            </div>
            <!-- 各等級內的優惠列表 -->
            <ul class="p-6 pt-0">
              <li
                class="bg_img"
                :style="item2.image && 'background-image: none'"
                v-for="(item2, index2) in item"
                :key="index2"
                :id="item2.id"
              >
                <a @click.prevent="viewDetail(item2)">
                  <div class="label">
                    <img
                      class="w-full h-full rounded-t-[0.16rem] object-cover"
                      :src="item2.image"
                    />
                    <div
                      class="label__state"
                      :class="`label__state--${item2.joined}`"
                    >
                      <div
                        class="label__state__text"
                        :class="locale !== 'tw' && 'label__state__text--resize'"
                      >
                        {{
                          item2.joined === 1 || item2.joined === 4
                            ? activityMessages("joined")
                            : item2.joined === 2 || item2.joined === 3
                            ? activityMessages("review")
                            : activityMessages("not_joined")
                        }}
                      </div>
                    </div>
                  </div>
                  <div class="pt-2 pb-2.5 px-4 space-y-1 bg-white rounded-b-sm">
                    <div class="text-28 text-[#2D2D2D] whitespace-pre-wrap">
                      {{ item2.title }}
                    </div>
                    <div class="flex items-center text-20 text-[#636363]">
                      <img
                        class="mr-1 w-[0.26rem] h-[0.26rem]"
                        src="@/assets/images/discount/icon_daily.svg"
                      />
                      <div>
                        {{ item2.start }} {{ activityMessages("during") }}
                        {{ item2.end }}
                      </div>
                      <div
                        class="ml-auto w-3 h-3 rounded-full"
                        :class="
                          item2?.tipType !== 'none'
                            ? 'bg-[#FF3D00]'
                            : 'bg-[#D9D9D9]'
                        "
                      />
                    </div>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </template>
        <div
          class="tabs__content__empty flex flex-col justify-center items-center text-28 text-[#b5b5b5]"
          v-if="discounts.isEmpty"
        >
          <img
            src="@/assets/images/discount/activity_image_empty.webp"
            alt=""
          />
          <div>
            {{ activityMessages("empty.message") }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { reactive, onMounted, inject, computed, nextTick } from "vue";
import { useAuthStore } from "@/store/auth-store";
import { useDiscountStore } from "@/store/discount-store";
import { useNotifyStore } from "@/store/notify-store";
import { useI18nService } from "@/services/i18n-service";
import { useDiscountWorkflow } from "@/workflows/discount-workflow";
import { usePopupWorkflow } from "@/workflows/common/popup-workflow";
import { storeToRefs } from "pinia";

/** components */
import rankDetail from "@/widgets/popup/home/rank-detail";
import DiscountDetail from "@/widgets/popup/discount/detail";

export default {
  setup() {
    const discountStore = useDiscountStore();
    const discountWorkflow = useDiscountWorkflow();
    const authStore = useAuthStore();
    const notifyStore = useNotifyStore();
    const { birds, snakes, discounts: discountsFromStore } = storeToRefs(
      discountStore
    );
    const $ = inject("$jQuery");
    const TabsSlider = inject("$tabsslider");
    const popupWorkflow = usePopupWorkflow();
    const { t: rootMessages, locale, scope } = useI18nService();
    const { t: activityMessages } = scope("pages.activity");

    const rankList = reactive({
      bird: birds,
      snake: snakes,
    });
    const discounts = reactive({
      list: discountsFromStore,
      isEmpty: false,
      guideId: -1,
    }); //用於優惠列表
    const vip = computed(() => ~~authStore.user.vip?.vip ?? 0);
    const vipInfo = reactive({
      meta: computed(() => discountStore.meta),
      list: computed(() => discountStore.vipList),
    });
    /* 取得優惠列表 */
    const getDiscountList = async () => {
      const res = await discountWorkflow.getDiscount();
      switch (res.state) {
        case res.origin.length > 0:
          /** 設定引導ID */
          showGuide(res.origin);
          /* 設定列表 這邊使用nextTick是因為plugin要等有dom時才可使用 */
          nextTick(setTab);
          break;

        default:
          discounts.isEmpty = true;
          break;
      }
    };
    const setTab = () => {
      // if(discounts.value.length === 0);
      new TabsSlider(".tabs", {
        slide: vip.value, // 若有要通知的優惠，以要通知的index為主
      });
      if (discounts.guideId !== -1) {
        /* 利用timeout讓畫面更協調，不會同時切換slide及scrollintoView */
        setTimeout(() => {
          $(`#${discounts.guideId}`).get(0).scrollIntoView({
            block: "center",
            behavior: "smooth",
            inline: "center",
          });
        }, 500);
      }
    };

    const read = (item) => {
      const { tipType, id } = item;
      if (tipType === "none") return;
      notifyStore.readNotify({
        type: tipType,
        msg: id,
      });
    };

    const viewDetail = async (item) => {
      read(item);
      const { isConfirmed } = await popupWorkflow.paging({
        title: item.title,
        component: DiscountDetail,
        showConfirmButton: true,
        confirmButtonText: activityMessages(`joined_btn.${item.joined}`),
        props: {
          allowConfirm: [0, 2].includes(item.joined),
          image: item.image,
          content: item.content,
          setting: {
            start: item.start,
            end: item.end,
            joined: item.joined,
            record: item.record?.[0] ?? {},
          },
        },
      });
      if (isConfirmed) {
        /** 若點擊確認鈕 */
        onApplyDiscount(item);
      }
    };

    const onApplyDiscount = async (item) => {
      const discountType = item.joined === 0 ? 1 : 0;
      const { id: discountId, auto_auth: discountAutoAuth } = item;
      const res = await discountWorkflow.applyDiscount({
        discountType,
        discountId,
        discountAutoAuth,
      });

      if (res.code !== 1) {
        const title = activityMessages(`apply.${discountType}.failed`);
        popupWorkflow.alert({
          title,
          text: rootMessages(`error.code.activity.apply.${res.code}`),
        });
        return;
      }

      popupWorkflow.toast(activityMessages(`apply.${discountType}.success`));
    };

    const onDetail = (type) => {
      popupWorkflow.rank({
        component: rankDetail,
        title: activityMessages(`hint.${type}`),
        showCancelButton: false,
        props: {
          list: rankList[type],
        },
      });
    };

    /** 引導id搜尋 */
    const showGuide = (ary) => {
      const reviewItem = notifyStore.getHadValueTypeFirstItem("promote_map");
      const joinItem = notifyStore.getHadValueTypeFirstItem("promote");
      let find = null;
      /* 若有資料且資料且msg(id)不為空 審核優先其次可參加 */
      if (reviewItem && reviewItem.msg !== "") {
        find = ary.find((item) => item.id == reviewItem.msg);
      } else if (joinItem && joinItem.msg !== "") {
        find = ary.find((item) => item.id == joinItem.msg);
      }
      /* 若有資料且在當前的等級的Tab內，則設定引導資料 */
      if (find) {
        const vipLevel = ~~authStore.user.vip?.vip ?? 0;
        const inCurrentTab = find.vip.includes(`${vipLevel}`);
        if (!inCurrentTab) return;
        const { id } = find;
        discounts.guideId = id;
      }
    };

    onMounted(() => {
      getDiscountList();
    });

    return {
      vip,
      locale,
      vipInfo,
      discounts,
      activityMessages,
      read,
      onDetail,
      viewDetail,
      // getDiscountList,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/scss/discount.scss";
</style>
