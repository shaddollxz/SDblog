export default <RouteItem>{
    path: "/:pathMatch(.*)*",
    name: "404 notfound",
    component: () => import("@views/404/index.vue"),
    meta: {
        keepAlive: true,
        title: "404",
    },
};
