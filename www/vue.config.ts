import { createApp } from "vue";
import { createWebHashHistory, createRouter } from "vue-router";
/**
 * styles
 */
import "~/styles/index.scss";
import "bootstrap-icons/font/bootstrap-icons.scss";
import "highlight.js/styles/github.css";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [{ path: "/", component: () => import("~/views/index.vue") }],
});

createApp({
  directives: {},
  components: {},
})
  .use(router)
  .mount("#app");
