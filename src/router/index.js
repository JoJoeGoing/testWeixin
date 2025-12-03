import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const routes = [
  {
    path: "/",
    component: () => import("@/views/layout"),
  },
  {
    path: "/map",
    name: "map",
    component: () => import("@/views/map/index.vue"),
    hidden: true,
    meta: {
      title: "地图",
    },
  },
];

const createRouter = () =>
  new Router({
    mode: "history", // require service support
    base: process.env.BASE_URL,
    scrollBehavior: () => ({
      y: 0,
    }),
    routes,
  });

const router = createRouter();
// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}
export default router;
