import Layout from "/@/layout/index.vue";

const route = {
  path: "/record",
  name: "record",
  component: Layout,
  redirect: "/record",
  meta: {
    icon: "el-icon-s-home",
    showLink: true,
    invisible: true,
    rank: 0
  },
  children: [
    {
      path: "/record",
      name: "RecordList",
      component: () => import("/@/views/record/index.vue"),
      meta: {
        title: "message.hsRecord",
        showLink: true
      }
    }
  ]
};

export default route;
