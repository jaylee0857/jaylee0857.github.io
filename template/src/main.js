import { createApp } from "vue";
import App from "./App";

/** plugins */
import jquery from "@/plugins/jquery";
import storage from "@/plugins/storage";
import tabsslider from "@/plugins/tabsslider";
import VueLazyLoad from "vue3-lazyload";
/** _app */
import layouts from "@/_app/layouts";
import components from "@/_app/components";
import services from "@/_app/services";
import "./assets/main.scss";
import "@fortawesome/fontawesome-free/js/all";
import directives from "@/_app/directives";

// import drag from "@/_app/buoyMove";
const app = createApp(App);
app.provide("$jQuery", jquery);
app.provide("$storage", storage);
app.provide("$tabsslider", tabsslider);
app.use(layouts);
app.use(components);
app.use(directives);
app.use(VueLazyLoad, {
  loading: "",
  error: "",
});
// app.use(drag);

/** services register / 自定義hook */
app.use(services);

app.mount("#app");
