export default <RouteItem>{
    path: "/essay",
    name: "essay",
    component: () => import("@views/Essay/index.vue"),
    meta: {
        title: "随笔",
        keepAlive: true,
    },
};
