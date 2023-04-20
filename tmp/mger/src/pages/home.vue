<template>
  <!-- ======= Header ======= -->
  <header id="header" class="fixed-top header-transparent">
    <div class="title_logo">
      <img class="logo_img" src="@/assets/img/mg/mg-nav.png" alt="" />
    </div>
    <div
      class="container d-flex align-items-center justify-content-between position-relative"
    >
      <div class="logo">
        <h1 class="text-light">
          <a href="index.html"
            ><img src="@/assets/img/mg/mg-nav.png" alt=""
          /></a>
        </h1>
        <!-- Uncomment below if you prefer to use an image logo -->
        <!-- <a href="index.html"><img src="assets/img/logo.png" alt="" class="img-fluid"></a>-->
      </div>

      <nav id="navbar" class="navbar">
        <ul :class="{ active: mobileToggle }">
          <li
            v-for="gameType in gameTypes"
            :key="gameType"
            :class="{ active: btnActive.gameBtn === gameType }"
            @click="gameBtn(gameType)"
          >
            <img
              v-if="btnActive.gameBtn === gameType"
              :src="getImageUrl(`${gameType}-btn-active.png`)"
              alt=""
            />
            <img v-else :src="getImageUrl(`${gameType}-btn.png`)" alt="" />
            {{ gameType.toUpperCase() }}
          </li>
        </ul>
        <i
          @click="mobileToggle = !mobileToggle"
          class="bi bi-list mobile-nav-toggle"
        ></i>
      </nav>
      <!-- .navbar -->
    </div>
  </header>
  <!-- End Header -->

  <main id="main">
    <section>
      <div class="marquee">
        <p>
          MOVA Gaming is like a new and powerful heart beating violently. It has
          a group of dream practitioners who are naturally playful and
          unfettered.
        </p>
      </div>
    </section>
  </main>
  <!-- End #main -->

  <!-- ======= Footer ======= -->
  <footer id="footer">
    <div
      class="container d-flex flex-column justify-content-center align-content-center"
    >
      <img class="logo_img" src="@/assets/img/mg/mg-nav.png" alt="" />
      <p class="d-flex justify-content-center">
        MOVA Gaming provides our partners plentiful products and professional
        services.
      </p>
      <ul>
        <li><img src="@/assets/img/mg/skype-icon.png" alt="" /></li>
        <li><img src="@/assets/img/mg/telegram-icon.png" alt="" /></li>
        <li><img src="@/assets/img/mg/email-icon.png" alt="" /></li>
        <li><img src="@/assets/img/mg/facebook-icon.png" alt="" /></li>
        <li><img src="@/assets/img/mg/twitter-icon.png" alt="" /></li>
        <li><img src="@/assets/img/mg/ig-icon.png" alt="" /></li>
      </ul>
      <div class="copyright">© MOVA Gaming 2023. All rights reserved.</div>
    </div>
  </footer>
  <!-- End Footer -->
</template>

<script>
import "@/assets/vendor/aos/aos.css";
import "@/assets/vendor/bootstrap/css/bootstrap.min.css";
import "@/assets/vendor/bootstrap-icons/bootstrap-icons.css";
import "@/assets/vendor/boxicons/css/boxicons.min.css";
import "@/assets/vendor/glightbox/css/glightbox.min.css";
import "@/assets/vendor/swiper/swiper-bundle.min.css";
import "@/assets/css/style.css";
import { reactive, ref, onMounted } from "vue";

const gameTypes = [
  "live",
  "sports",
  "lottery",
  "slot",
  "elect",
  "fish",
  "chess",
  "contact",
];

export default {
  name: "Home",
  setup() {
    const mobileToggle = ref(false);
    const btnActive = reactive({
      gameBtn: "contact",
    });
    const gameBtn = (gameType) => {
      mobileToggle.value = false;
      btnActive.gameBtn = gameType;
    };
    const getImageUrl = (name) => {
      return new URL(`../assets/img/mg/${name}`, import.meta.url).href;
    };
    onMounted(() => {
      console.log("ok");
    });
    return { btnActive, gameBtn, getImageUrl, gameTypes, mobileToggle };
  },
};
</script>
