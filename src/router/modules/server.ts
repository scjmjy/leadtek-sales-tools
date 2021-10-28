import Layout from "/@/layout/index.vue";

const route = {
  path: "/server",
  name: "server",
  component: Layout,
  redirect: "/server",
  meta: {
    // icon: "el-icon-s-home",
    title: "message.hsServer",
    showLink: true,
    rank: 0
  },
  children: [
    {
      path: "/server",
      name: "ServerList",
      component: () => import("/@/views/server/index.vue"),
      meta: {
        title: "message.hsServer",
        showLink: true
      }
    },
    {
      path: "/server/detail",
      name: "ServerDetail",
      component: () => import("/@/views/server/server-detail.vue"),
      meta: {
        title: "message.hsServerDetail",
        showLink: true,
        invisible: true
      }
    }
  ]
};

export default route;
