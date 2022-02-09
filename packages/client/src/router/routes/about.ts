export default <RouteItem>{
    path: "/about",
    name: "about",
    component: () => import("@views/About/index.vue"),
    meta: {
        title: "关于",
        keepAlive: true,
    },
};
