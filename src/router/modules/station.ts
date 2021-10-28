import Layout from "/@/layout/index.vue";

function stationBeforeEnter(to, from, next) {
  to.query.isStation = true;
  next();
}

const route = {
  path: "/station",
  name: "station",
  component: Layout,
  redirect: "/station",
  meta: {
    title: "message.hsStation",
    showLink: true,
    rank: 0
  },
  children: [
    {
      path: "/station",
      name: "StationList",
      component: () => import("/@/views/server/index.vue"),
      beforeEnter: stationBeforeEnter,
      meta: {
        title: "message.hsStation",
        showLink: true
      }
    },
    {
      path: "/station/detail",
      name: "StationDetail",
      component: () => import("/@/views/server/server-detail.vue"),
      beforeEnter: stationBeforeEnter,
      meta: {
        title: "message.hsServerDetail",
        showLink: true,
        invisible: true
      }
    }
  ]
};

export default route;
