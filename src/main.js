import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// 自定义注册plugins
import qiuui from "./qiuui";
export const app = createApp(App);
qiuui(app);
createApp(App).use(store).use(router).use(qiuui).mount("#app");
