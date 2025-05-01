import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router"; // ajout

export const app_url = "http://localhost:3000"; // URL de l'API Express
createApp(App).use(router).mount("#app");
