import App from "./App.vue";

import { createPinia } from "pinia";
import router from "@/router";
import SDT from "sdt3";
import "sdt3/style";

import globalProperties from "@/plugins/globalProperties";
import globalComponents from "@/plugins/globalComponents";
import "@/plugins/customElements";
import "@/plugins/globalVariables";

import "@/plugins/initRem";
import "@/plugins/pwa";
import "virtual:svg-icons-register";

import "@/style/global/index.scss";
import "@/assets/font/index.css";

createApp(App)
    .use(createPinia())
    .use(router)
    .use(SDT)
    .use(globalProperties)
    .use(globalComponents)
    .mount("#app");
