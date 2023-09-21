<template>
  <div class="recommends">
    <div class="invite content">
      <div class="title">
        <div class="line"></div>
        <span class="font">
          {{ t("pages.promote.title.invite") }}
        </span>
        <span @click="alertIllustrate('visite')" class="icon question"></span>
      </div>
      <div class="qr">
        <qrcode-vue class="qr" :value="form.qrcode" :size="200" level="H" />
      </div>
      <div class="text">
        <p>{{ t("pages.promote.code") }}</p>
        <p class="code">{{ form.code }}</p>
        <p class="icon invi" @click="share"></p>
      </div>
    </div>
    <div class="content add">
      <div class="title">
        <div class="line"></div>
        <span class="font">
          {{ t("pages.promote.title.join") }}
        </span>
        <span @click="alertIllustrate('join')" class="icon question"></span>
      </div>
      <div class="without" v-if="!form.user.parent">
        <div class="enter">
          <p>
            {{ t("pages.promote.code") }}
          </p>
          <p>
            <input
              type="text"
              :placeholder="t('pages.promote.code.placeholder')"
              v-model="form.enterCode"
            />
          </p>
        </div>
        <div class="reader" v-if="!form.readOpen" @click="form.readOpen = true">
          <div>
            {{ t("pages.promote.code.scan") }}
          </div>
          <div class="icon read"></div>
        </div>
        <div class="reader" v-else>
          <qr-stream @decode="onDecode"></qr-stream>
          <div class="icon close" @click="form.readOpen = false"></div>
        </div>
        <div
          class="submit"
          :class="{ disabled: form.enterCode === '' }"
          @click="setIntroducer"
        >
          {{ t("pages.promote.submit") }}
        </div>
      </div>
      <div class="have" v-else>
        <div>
          {{ t("pages.promote.join.parent") }}
        </div>
        <div class="parent">
          <div><p class="icon selected"></p></div>
          <!-- <div>{{ form.user.parent.account }}</div> -->
          <div>{{ form.user.parent.account }}</div>
          <div>1</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, computed } from "vue";
import { useAuthStore } from "@/store/auth-store";
import { useHttpService } from "@/services/http-service";
import { useI18nService } from "@/services/i18n-service";
import { useAlertService } from "@/services/alert-service";
import QrcodeVue from "qrcode.vue";
import { QrStream } from "vue3-qr-reader";

export default {
  components: {
    QrcodeVue,
    QrStream,
  },
  setup() {
    const http = useHttpService();
    const authStore = useAuthStore();
    const { t } = useI18nService();
    const alertService = useAlertService();
    const form = reactive({
      qrcode: "",
      code: "",
      user: computed(() => authStore.user),
      enterCode: "",
      readOpen: false,
    });
    const getUser = async () => {
      //用於測試取得user資料
      let res = await authStore.getUser();
      return res;
    };

    const getData = async () => {
      let url = new URL(window.location.href).origin;
      form.code = form.user.promote_code;
      url = `${url}?code=${form.code}/#/signup`;
      form.qrcode = url;
      console.log(url);
    };

    const onDecode = (res) => {
      let code = res || "";
      if (code === "") return;
      form.readOpen = false;
      code = code.split("=").pop().replace("/#/signup", "");
      form.enterCode = code;
    };

    const share = () => {
      console.log(
        t("pages.promote.share.text", {
          user: form.user.account,
          link: import.meta.env.VITE_LOGO_NAME,
        })
      );
      if (navigator.share) {
        navigator
          .share({
            title: t("pages.promote.share.text", {
              user: form.user.account,
              link: import.meta.env.VITE_LOGO_NAME,
            }),
            text: t("pages.promote.share.text", {
              user: form.user.account,
              link: import.meta.env.VITE_LOGO_NAME,
            }),
            url: form.qrcode,
          })
          .then(() => {
            console.log("suc");
          });
      } else {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(form.qrcode);
          alertService.alert({
            title: t("app.dialog.system.title2"),
            text: "copied",
          });
        }
      }
    };

    const setIntroducer = async () => {
      if (form.enterCode === "") return;
      let res = await http.post("/app/user/introducer", {
        promote_code: form.enterCode,
      });
      let loading = false;
      switch (res.code) {
        case 1:
          loading = await getUser();
          if (loading) {
            alertService.alert({
              title: t("app.dialog.system.title2"),
              text: t("pages.promote.joinSuc"),
            });
          } else {
            alertService.alert({
              title: t("app.dialog.system.title2"),
              text: t("pages.promote.refreshFail"),
            });
          }
          break;
        case -3:
          alertService.alert({
            title: t("app.dialog.system.title2"),
            text: t("pages.promote.joinFailOwn"),
          });
          break;
        case -4:
          alertService.alert({
            title: t("app.dialog.system.title2"),
            text: t("pages.promote.joinFailNot"),
          });
          break;
        case -5:
          alertService.alert({
            title: t("app.dialog.system.title2"),
            text: t("pages.promote.inviteIllustrate"),
          });
          break;
      }
    };

    const alertIllustrate = (type) => {
      alertService.alert({
        title:
          type === "join"
            ? t("pages.promote.join.alert.title")
            : t("pages.promote.invite.alert.title"),
        text:
          type === "join"
            ? t("pages.promote.join.alert.text")
            : t("pages.promote.invite.alert.text"),
        confirmButtonText: t("pages.promote.join.alert.confirm.text"),
      });
    };
    if (getUser()) {
      getData();
    }
    return { t, share, onDecode, setIntroducer, alertIllustrate, form };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/recommend.scss";
</style>
