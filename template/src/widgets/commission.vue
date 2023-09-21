<template>
  <div class="commission">
    <ul class="action">
      <li>
        <div>
          <div class="text">
            {{ t("pages.promote.commission.withdraw") }}
          </div>
          <div class="amount">
            <div>$</div>
            <div
              class="amount__dallor mr-1.5"
              :class="{ 'text-gray-300': form.freshFlagToday }"
            >
              {{ ~~form.promotion_commissions }}
            </div>
            <div
              class="text-28 text-[#3d72fa]"
              @click="(e) => reFresh('today', e)"
            >
              <i class="fas fa-sync-alt"></i>
            </div>
          </div>
        </div>
        <div class="btn" :class="{ ph: locale === 'ph' }" @click="withdraw">
          {{ t("pages.promote.commission.withdraw.button") }}
        </div>
      </li>
      <li>
        <div>
          <div class="text">
            {{ t("pages.promote.commission.withdraw.tomorrow") }}
          </div>
          <div class="amount">
            <div>$</div>
            <div
              class="amount__dallor mr-1.5"
              :class="{ 'text-gray-300': form.freshFlagTomorrow }"
            >
              {{ ~~form.tomorrow_receivable }}
            </div>
            <div class="text-28 text-[#3d72fa]" @click="(e) => reFresh('m', e)">
              <i class="fas fa-sync-alt"></i>
            </div>
          </div>
        </div>
      </li>
      <li class="recode">
        <a @click.prevent="setIndex('/recommend/commissionrecord')">
          <div class="icon exclamation"></div>
          <div class="text">
            {{ t("pages.promote.commission.withdraw.record") }}
          </div>
        </a>
      </li>
    </ul>
    <div class="relation">
      <div class="top">
        <div class="text">
          {{ t("pages.promote.commission.parent") }}
        </div>
        <div class="item">
          {{ form.parent.account ? form.parent.account : "-" }}
        </div>
      </div>
      <div class="bottom">
        <div class="text">
          {{ t("pages.promote.commission.descendants") }}
        </div>
        <div class="item">
          {{ form.descendants_count
          }}<span style="color: #404553; margin-left: 0.1rem">{{
            t("pages.promote.commission.records.unit")
          }}</span>
        </div>
        <span class="icon"></span>
        <a @click.prevent="setIndex('/recommend/descendants')"></a>
      </div>
    </div>
    <div class="event">
      <div class="title">
        {{ t("pages.promote.commission.records.title") }}
      </div>
      <ul>
        <li v-if="form.events.length === 0">
          {{ t("pages.promote.commission.records.empty") }}
        </li>
        <li v-else v-for="item in form.events" :key="item.id">
          <div class="icon gift"></div>
          <div class="content">
            <div class="text">
              <span>{{ item.name }}</span>
              <span class="allow">
                {{ t("pages.promote.commission.records.status.1") }}
              </span>
            </div>
            <div class="number">{{ ~~item.amount }}</div>
          </div>
          <span class="icon arrow"></span>
          <a
            @click.prevent="
              setPagesData(item);
              setIndex('/recommend/eventsrecord');
            "
          ></a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useHttpService } from "@/services/http-service";
import { useI18nService } from "@/services/i18n-service";
import { useAlertService } from "@/services/alert-service";
import { useAuthStore } from "@/store/auth-store";
import gsap from "gsap";

export default {
  setup() {
    const router = useRouter();
    const store = useStore();
    const authStore = useAuthStore();
    const http = useHttpService();
    const alertService = useAlertService();
    const { t, locale } = useI18nService();
    const form = reactive({
      parent: "",
      descendants_count: 0,
      tomorrow_receivable: 0,
      promotion_commissions: 0,
      events: [],
      freshFlagToday: false,
      freshFlagTomorrow: false,
    });

    const obj2ary = (obj) => {
      return Object.values(obj);
    };

    const getData = async () => {
      let res = await http.get("/app/commissions", {
        params: {
          status: 1,
        },
      });
      if (res.code !== 1) return;
      form.parent = res.data.parent ? res.data.parent : "-";
      form.descendants_count = res.data.descendants_count;
      form.tomorrow_receivable = res.data.tomorrow_receivable;
      form.events = res.data.promotion_commissions;
      res = await authStore.getUser();
      form.promotion_commissions = authStore.user.commission;
      form.events = obj2ary(form.events);
      console.log(form.events);
      return res;
    };

    const setIndex = (route) => {
      store.dispatch("app/read/recommendIndex", 1);
      router.push(route);
    };

    const setPagesData = (data) => {
      store.commit("app/set/pagesData", data);
      // store.dispatch("app/read/pagesData", data);
      // setIndex()
    };

    const reFresh = async (day, e) => {
      const animate = gsap.to(e.target, {
        rotation: 360,
        repeat: -1,
        transformOrigin: "center",
        duration: 1,
      });
      if (day === "today") {
        form.freshFlagToday = true;
      } else {
        form.freshFlagTomorrow = true;
      }
      let res = (await getData()) || "";
      form.freshFlagToday = false;
      form.freshFlagTomorrow = false;
      animate.kill();
      gsap.set(e.target, { rotation: 0, duration: 0 });
      if (res === "")
        return alertService.alert({
          title: t("app.dialog.system.title2"),
          text: t("pages.promote.refreshFail"),
        });
    };

    const withdraw = async () => {
      alertService.showLoading();
      if (form.promotion_commissions <= 0)
        return alertService.alert({
          title: t("app.dialog.system.title2"),
          text: t("error.code.withdraw.-3"),
        });
      let res = await http.post("/app/promotion-records/receive");
      alertService.close();

      if (res.code == -1)
        return alertService.alert({
          title: t("app.dialog.system.title2"),
          text: t("error.code.withdraw.-1"),
        });
      if (res.code == -2)
        return alertService.alert({
          title: t("app.dialog.system.title2"),
          text: t("pages.promote.commission.withdraw.action.agent"),
        });
      setTimeout(() => {
        getData();
        alertService.alert({
          title: t("feedback.action.success"),
          text: t("pages.promote.commission.withdraw.action.success"),
        });
      }, 3000);
    };

    onMounted(() => {
      getData();
    });
    return { t, setIndex, setPagesData, reFresh, withdraw, form, locale };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/recommend.scss";
</style>
