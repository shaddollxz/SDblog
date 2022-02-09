export default <RouteItem>{
    path: "/blog/:blogId",
    name: "blog",
    component: () => import("@views/Blog/index.vue"),
    meta: {
        keepAlive: false,
        title: "",
    },
};
