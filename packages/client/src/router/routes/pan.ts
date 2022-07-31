export default <RouteItem>{
    path: "/pan",
    name: "pan",
    component: () => import("@/views/Pan/index.vue"),
    meta: {
        keepAlive: true,
        title: "云盘",
        // needLogin: true,
    },
};
