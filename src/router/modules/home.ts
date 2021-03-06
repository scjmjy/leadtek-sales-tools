import Layout from "/@/layout/index.vue";

const homeRouter = {
  path: "/",
  name: "home",
  component: Layout,
  redirect: "/welcome",
  meta: {
    // icon: "el-icon-s-home",
    showLink: true,
    rank: 0
  },
  children: [
    {
      path: "/welcome",
      name: "welcome",
      component: () => import("/@/views/welcome.vue"),
      meta: {
        title: "message.hshome",
        showLink: true
      }
    },
    {
      path: "/user",
      name: "user",
      component: () => import("/@/views/user/index.vue"),
      meta: {
        title: "message.hsPersonal",
        showLink: true,
        invisible: true
      }
    }
  ]
};

export default homeRouter;
