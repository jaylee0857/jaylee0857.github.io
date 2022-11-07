<template>
  <div id="bg">
    <section id="players_bg">
      <div id="top_playerL"></div>
      <div id="top_playerR"></div>
    </section>
    <section id="illustrate">
      <div class="title font-middle">
        <img src="@/assets/images/top_decorateL.png" alt="" />
        <span>{{ t("pages.worldcup.fifa.title.1") }}</span>
        <img src="@/assets/images/top_decorateR.png" alt="" />
      </div>
      <div class="content font-regular">
        {{ t("pages.worldcup.fifa.title.2") }}
      </div>
      <div class="picture_group">
        <img src="@/assets/images/top_giftCertificateL.png" alt="" />
        <img src="@/assets/images/top_giftCertificateR.png" alt="" />
      </div>
    </section>

    <section id="btn_groups">
      <h2 class="font-middle">{{ t("pages.worldcup.group.title") }}</h2>
      <div v-for="items in btnList" :key="items" class="item_box">
        <div class="item_title">
          <img
            class="decorate"
            src="@/assets/images/main_decorate.png"
            alt=""
          />
          <img class="group_img" :src="getImageUrl(items.title_img)" alt="" />
          <img
            class="decorate"
            src="@/assets/images/main_decorate.png"
            alt=""
          />
        </div>
        <div class="item_btns">
          <div
            @click="ranking(item.name, item.img)"
            v-for="item in items.country"
            :key="item"
          >
            <div class="img_box">
              <img
                v-if="chosenListImg[0] === item.img"
                class="no1_flower"
                src="@/assets/images/main_No1.png"
                alt=""
              />
              <img
                v-if="chosenListImg[0] === item.img"
                class="no1_trophy"
                src="@/assets/images/main_No1-2.png"
                alt=""
              />
              <img
                v-if="chosenListImg[1] === item.img"
                class="selected"
                src="@/assets/images/main_No2.png"
                alt=""
              />
              <img
                v-if="chosenListImg[2] === item.img"
                class="selected"
                src="@/assets/images/main_No3.png"
                alt=""
              />
              <img
                v-if="chosenListImg[3] === item.img"
                class="selected"
                src="@/assets/images/main_No4.png"
                alt=""
              />
              <img class="logo" :src="getImageUrl(item.img)" alt="" />
            </div>
            <p class="font-middle">{{ item.name }}</p>
          </div>
        </div>
      </div>
    </section>

    <section id="form">
      <h3 class="font-regular">{{ t("pages.worldcup.form.h3") }}</h3>
      <p class="chose_item">
        <span v-if="chosenListName[0] ?? false">{{
          t("pages.worldcup.form.team", { no: 1, team: chosenListName[0] })
        }}</span>
        <span v-if="chosenListName[1] ?? false"
          >、{{
            t("pages.worldcup.form.team", { no: 2, team: chosenListName[1] })
          }}</span
        >
        <span v-if="chosenListName[2] ?? false"
          >、{{
            t("pages.worldcup.form.team", { no: 3, team: chosenListName[2] })
          }}</span
        >
        <span v-if="chosenListName[3] ?? false"
          >、{{
            t("pages.worldcup.form.team", { no: 4, team: chosenListName[3] })
          }}</span
        >
      </p>
      <div id="btn_box">
        <div id="phone">
          <input
            class="font-regular"
            type="text"
            :placeholder="t('pages.worldcup.form.phoneplz')"
            v-model="phone"
          />
          <div
            id="send_phone"
            :class="{ active: phoneIsValid2 }"
            @click="getSMS()"
          >
            <span v-if="sec === 60">{{ t("pages.worldcup.form.sent") }}</span>
            <span v-else>{{ sec }}</span>
          </div>
        </div>
        <div id="phone_verify" class="content_middle">
          <span class="content_middle" v-if="phoneIsValid"
            ><img src="@/assets/images/alarm.png" alt="" />
            {{ t("pages.worldcup.form.errorphone") }}</span
          >
        </div>
        <div id="smsBox">
          <input
            class="font-regular"
            type="text"
            :placeholder="t('pages.worldcup.form.smsplz')"
            v-model="sms"
          />
          <div style="background-color: transparent">
            <img v-if="smsIsValid2" src="@/assets/images/OK.png" alt="" />
            <img v-if="smsIsValid" src="@/assets/images/X.png" alt="" />
          </div>
        </div>
        <div id="opt_verify" class="content_middle">
          <span class="content_middle" v-if="smsIsValid"
            ><img src="@/assets/images/alarm.png" alt="" />{{
              t("pages.worldcup.form.erroropt")
            }}</span
          >
        </div>
        <div @click="setData()" :class="{ active: complete }" id="send_form">
          {{ t("pages.worldcup.form.send") }}
        </div>
      </div>
      <p id="fb" class="content_middle">
        <span>主辦廠商</span>
        <a
          class="content_middle"
          href="https://m.facebook.com/goctrutgiandailoan/"
          ><img src="@/assets/images/FB.png" alt="" />
          https://m.facebook.com/goctrutgiandailoan/</a
        >
      </p>
    </section>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { reactive, ref, watch, computed } from "vue";
import * as R from "ramda";
import useI18n from "@/hooks/use-i18n";
import { useStore } from "vuex";
export default {
  name: "Home",
  setup() {
    const { t } = useI18n();
    const chosenListImg = reactive([]);
    const chosenListName = reactive([]);
    const phone = ref("");
    const sms = ref("");
    const complete = computed(
      () =>
        chosenListName.length === 4 &&
        phone.value.length === 10 &&
        sms.value.length === 4
    );
    const phoneIsValid = ref(false);
    const phoneIsValid2 = ref(false);
    const smsIsValid = ref(false);
    const smsIsValid2 = ref(false);
    const store = useStore();
    const apiData = reactive({
      phone: "",
      captcha: "",
      note: "",
    });
    let sec = ref(60);
    const replaceText = (str) => {
      if (typeof str !== "string") return "";
      return str.replace(
        /[\u4e00-\u9fa5_a-zA-Z`~!@#$%^&amp;*()_\-+=&lt;&gt;?:"{}|,./;'\\[\]·~！@#￥%……&amp;*（）——\-+={}|《》？：“”【】、；‘'，。、 ]/g,
        ""
      );
    };
    const countDown = () => {
      let clock = window.setInterval(() => {
        sec.value--;
        console.log(sec.value);
        if (sec.value < 0) {
          //当倒计时小于0时清除定时器
          window.clearInterval(clock);
          sec.value = 60;
        }
      }, 1000);
    };

    const getSMS = async () => {
      if (sec.value !== 60) return;
      let phoneNumber = phone.value;
      if (phone.value.length !== 10)
        return Swal.fire({ title: "電話號碼須10碼" });
      if (phone.value[0] === "0") {
        const tmp = phone.value.split("").filter((data, index) => index !== 0);
        phoneNumber = "886" + tmp.join("");
      } else {
        return Swal.fire({ title: "電話號碼須以09開頭" });
      }
      const res = await store.dispatch("worldcup/api/sms", phoneNumber);
      console.log(res.code);
      countDown();
      Swal.fire({ title: t(`error.sms.${res.code}`) });
    };
    const setData = async () => {
      console.log(chosenListName.length);
      if (chosenListName.length !== 4) {
        return Swal.fire({ title: t(`error.set-data.failArray`) });
      }
      if (sms.value.length !== 4) {
        return Swal.fire({ title: t(`error.set-data.failsms`) });
      }
      let phoneNumber = phone.value;
      if (phone.value[0] === "0") {
        const tmp = phone.value.split("").filter((data, index) => index !== 0);
        phoneNumber = "886" + tmp.join("");
      } else {
        return Swal.fire({ title: "電話號碼須以09開頭" });
      }
      apiData.phone = phoneNumber;
      apiData.captcha = sms.value;
      apiData.note = chosenListName.join(",");
      const res = await store.dispatch("worldcup/api/set-data", apiData);
      console.log(res);
      Swal.fire({ title: t(`error.set-data.${res.code}`) });
    };
    const ranking = (name, img) => {
      console.log(name, img);
      const index = chosenListImg.indexOf(img);
      if (index > -1) {
        chosenListImg.splice(index, 1);
        chosenListName.splice(index, 1);
      } else {
        if (R.length(chosenListImg) < 4) {
          chosenListImg.push(img);
          chosenListName.push(name);
        }
      }
    };
    const btnList = reactive([
      {
        // A組：卡達、厄瓜多爾、塞內加爾、荷蘭
        title_img: "A",
        country: [
          {
            name: "卡達",
            img: "A_1",
          },
          {
            name: "厄瓜多爾",
            img: "A_2",
          },
          {
            name: "塞內加爾",
            img: "A_3",
          },
          {
            name: "荷蘭",
            img: "A_4",
          },
        ],
      },
      {
        // B組：英格蘭、伊朗、美國、威爾士
        title_img: "B",
        country: [
          {
            name: "英格蘭",
            img: "B_1",
          },
          {
            name: "伊朗",
            img: "B_2",
          },
          {
            name: "美國",
            img: "B_3",
          },
          {
            name: "威爾士",
            img: "B_4",
          },
        ],
      },
      {
        // C組：阿根廷、沙特、墨西哥、波蘭
        title_img: "C",
        country: [
          {
            name: "阿根廷",
            img: "C_1",
          },
          {
            name: "沙特",
            img: "C_2",
          },
          {
            name: "墨西哥",
            img: "C_3",
          },
          {
            name: "波蘭",
            img: "C_4",
          },
        ],
      },
      {
        // D組：法國、澳大利亞、丹麥、突尼斯
        title_img: "D",
        country: [
          {
            name: "法國",
            img: "D_1",
          },
          {
            name: "澳大利亞",
            img: "D_2",
          },
          {
            name: "丹麥",
            img: "D_3",
          },
          {
            name: "突尼斯",
            img: "D_4",
          },
        ],
      },
      {
        // E組：西班牙、哥斯大黎加、德國、日本
        title_img: "E",
        country: [
          {
            name: "西班牙",
            img: "E_1",
          },
          {
            name: "哥斯大黎加",
            img: "E_2",
          },
          {
            name: "德國",
            img: "E_3",
          },
          {
            name: "日本",
            img: "E_4",
          },
        ],
      },
      {
        // F組：比利時、加拿大、摩洛哥、克羅埃西亞
        title_img: "F",
        country: [
          {
            name: "比利時",
            img: "F_1",
          },
          {
            name: "加拿大",
            img: "F_2",
          },
          {
            name: "摩洛哥",
            img: "F_3",
          },
          {
            name: "克羅埃西亞",
            img: "F_4",
          },
        ],
      },
      {
        // G組：巴西、塞爾維亞、瑞士、喀麥隆
        title_img: "G",
        country: [
          {
            name: "巴西",
            img: "G_1",
          },
          {
            name: "塞爾維亞",
            img: "G_2",
          },
          {
            name: "瑞士",
            img: "G_3",
          },
          {
            name: "喀麥隆",
            img: "G_4",
          },
        ],
      },
      {
        // H組：葡萄牙、迦納、烏拉圭、韓國
        title_img: "H",
        country: [
          {
            name: "葡萄牙",
            img: "H_1",
          },
          {
            name: "迦納",
            img: "H_2",
          },
          {
            name: "烏拉圭",
            img: "H_3",
          },
          {
            name: "韓國",
            img: "H_4",
          },
        ],
      },
    ]);
    const getImageUrl = (group) => {
      return new URL(
        `/src/assets/images/main_Group${group}.png`,
        import.meta.url
      ).href;
    };
    watch(
      () => phone.value,
      () => {
        phone.value = replaceText(phone.value);
        if (phone.value.length > 10) phone.value = phone.value.substr(0, 10);
        if (phone.value.length === 10) {
          phoneIsValid2.value = true;
          phoneIsValid.value = false;
        } else {
          phoneIsValid.value = true;
          phoneIsValid2.value = false;
        }
      }
    );
    watch(
      () => sms.value,
      () => {
        sms.value = replaceText(sms.value);
        if (sms.value.length > 4) sms.value = sms.value.substr(0, 4);
        if (sms.value.length === 4) {
          smsIsValid2.value = true;
          smsIsValid.value = false;
        } else {
          smsIsValid.value = true;
          smsIsValid2.value = false;
        }
      }
    );
    return {
      t,
      btnList,
      getImageUrl,
      chosenListImg,
      chosenListName,
      ranking,
      phone,
      getSMS,
      phoneIsValid,
      phoneIsValid2,
      sms,
      smsIsValid,
      smsIsValid2,
      setData,
      complete,
      sec,
    };
  },
};
</script>
<style lang="scss" scoped>
// 標準
.font-regular {
  font-family: PingFangTC-Regular, PingFangSC-Regular, sans-serif;
}
// 細體
.font-light {
  font-family: PingFangTC-Light, PingFangSC-Light, sans-serif;
}
// 中黑體
.font-middle {
  font-family: PingFangTC-Medium, PingFangSC-Medium, sans-serif;
}

.content_middle {
  display: flex;
  justify-content: center;
  align-items: center;
}
#fb {
  display: flex;
  flex-direction: column;
  font-size: 1.1rem;
  color: #1b3771;
  span {
    margin-bottom: 1.5rem;
  }
  img {
    width: 16px;
    margin-right: 0.5rem;
  }
  a {
    text-decoration: none;
    color: #1b3771;
  }
}
#bg {
  width: 100%;
  max-width: 1125px;
  min-height: 4000px;
  padding-top: 300px;
  padding-bottom: 5rem;
  margin: 0 auto;
  background-image: url("@/assets/images/bg.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  @media (max-width: 1125px) {
    padding-top: 28.5%;
    min-height: unset;
  }
  @media (max-width: 900px) {
    background-size: contain;
    margin-bottom: 30px;
    padding-bottom: 0;
  }

  #players_bg {
    position: relative;
    width: 100%;
    margin-bottom: 10%;
    #top_playerL {
      position: absolute;
      top: 110px;
      left: 0;
      max-width: 259px;
      width: 23%;
      height: 525px;
      background-image: url("@/assets/images/top_playerL.png");
      background-repeat: no-repeat;
      background-size: contain;
      @media (max-width: 1125px) {
        top: 0;
      }
    }
    #top_playerR {
      position: absolute;
      right: 0;
      top: 90px;
      max-width: 237px;
      width: 21%;
      height: 539px;
      background-image: url("@/assets/images/top_playerR.png");
      background-repeat: no-repeat;
      background-size: contain;
      @media (max-width: 1125px) {
        top: 0;
      }
    }
  }

  #illustrate {
    max-width: 870px;
    margin: 0 auto;
    padding-top: 110px;
    @media (max-width: 1125px) {
      padding-top: 5rem;
      position: relative;
    }
    .title {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      max-width: 51.25rem;
      margin: 0 auto;
      color: #9f130c;
      font-size: 1.875rem;

      img {
        width: 28%;
        height: 1rem;
        margin-bottom: 4px;
      }
    }
    .content {
      padding: 1.375rem 2.3em;
      line-height: 1.5;
      font-size: 1.375rem;
      text-align: center;
      color: #1b3771;
      @media (max-width: 1125px) {
        width: 77%;
        margin: 0 auto;
      }
      @media (max-width: 768px) {
        padding: 1.375rem 9rem;
        width: 77%;
        margin: 0 auto;
      }
    }
    .picture_group {
      position: relative;
      display: flex;
      justify-content: space-between;
      @media (max-width: 1125px) {
        justify-content: center;
        width: 77%;
        margin: 0 auto;
      }
      img {
        @media (max-width: 1125px) {
          width: 50%;
          margin: 0 10px;
        }
      }
    }
  }

  #btn_groups {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 2rem;
    color: #9f130c;
    @media (max-width: 900px) {
      // background-image: url("@/assets/images/bg3.jpg");
      background-repeat: no-repeat;
      background-size: cover;
    }
    h2 {
      margin-bottom: 3rem;
      text-align: center;
      font-size: 1.688rem;
    }
    .item_box {
      width: 850px;
      @media (max-width: 1125px) {
        width: 75%;
      }
      .item_title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        @media (max-width: 1125px) {
          .group_img {
            width: 33%;
          }
          .decorate {
            width: 30%;
          }
        }
      }

      .item_btns {
        display: flex;
        justify-content: space-between;
        margin-bottom: 3.75rem;
        font-size: 1.75rem;
        color: #1d1d1d;

        .img_box {
          position: relative;
          cursor: pointer;
          .no1_flower {
            position: absolute;
            top: -20%;
            left: 50%;
            transform: translate(-50%, 0);
            z-index: 0;
            @media (max-width: 1125px) {
              width: 100%;
            }
          }
          .no1_trophy {
            position: absolute;
            bottom: 0;
            right: 0;
            z-index: 2;
            @media (max-width: 1125px) {
              width: 30%;
            }
          }
          .logo {
            z-index: 1;
            @media (max-width: 1125px) {
              width: 100%;
            }
          }
          .selected {
            position: absolute;
            top: -20%;
            left: 0;
            z-index: 1;
            @media (max-width: 1125px) {
              width: 39%;
            }
          }
        }
        div {
          display: flex;
          flex-direction: column;
          align-items: center;

          p {
            font-size: 1.75rem;
          }
        }
      }
    }
  }

  #form {
    display: flex;
    flex-direction: column;
    align-items: center;
    @media (max-width: 900px) {
      background-image: url("@/assets/images/bg2.jpg");
      background-size: cover;
      margin: -2px 0;
    }
    h3 {
      margin-bottom: 1.25rem;
      font-size: 3.438rem;
      font-weight: 500;
      color: #1d1d1d;
      @media (max-width: 1125px) {
        font-size: 3rem;
      }
    }
    .chose_item {
      padding: 0 15px;
      text-align: center;
      line-height: 1.5;
      font-size: 1.625rem;
      color: #db0000;
      @media (max-width: 1125px) {
        font-size: 2rem;
      }
      @media (max-width: 768px) {
        font-size: 1.625rem;
      }
    }

    #btn_box {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      padding: 5rem 0 0 0;
      @media (max-width: 1125px) {
        padding: 5rem 15px 0 15px;
      }

      #phone,
      #smsBox {
        position: relative;
        @media (max-width: 768px) {
          width: 100%;
        }
        div {
          position: absolute;
          top: 50%;
          right: 0;
          transform: translateY(-50%);
          display: flex;
          justify-content: center;
          align-items: center;
          width: 130px;
          height: 50px;
          background-color: #a7a7a7;
          color: #fff;
          @media (max-width: 768px) {
            width: 80px;
          }
          @media (max-width: 500px) {
            width: 60px;
          }
        }

        #send_phone {
          border: 1px solid #db0000;
          border-radius: 5px;
          cursor: not-allowed;
          @media (max-width: 500px) {
            font-size: 2rem;
          }
          &.active {
            color: #bd0000;
            background-color: #fff0eb;
            cursor: pointer;
          }
        }
      }
      #phone_verify,
      #opt_verify {
        height: 35px;
        span {
          color: #db0000;
        }
        img {
          width: 16px;
          margin-right: 0.5rem;
        }
      }

      input {
        width: 450px;
        height: 50px;
        padding-left: 10px;
        border-radius: 5px;
        font-size: 1.125rem;
        color: #1d1d1d;
        border: 1px solid #db0000;
        outline: none;

        @media (max-width: 768px) {
          width: 100%;
          font-size: 2rem;
        }
      }
      input:focus {
        outline: none;
        border: 2px solid #db0000;
      }
    }

    #send_form {
      display: flex;
      justify-content: center;
      align-items: center;
      max-width: 450px;
      width: 450px;
      height: 60px;
      margin: 4.375rem 0;
      border-radius: 5px;
      color: white;
      background-image: linear-gradient(to right, #868686, #a7a7a7);
      cursor: not-allowed;
      @media (max-width: 768px) {
        max-width: unset;
        width: 100%;
        height: 50px;
        font-size: 2rem;
      }
      &.active {
        cursor: pointer;
        background-image: linear-gradient(to right, #db0000, #db5200);
      }
    }
  }
}
</style>
