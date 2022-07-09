export default <RouteItem>{
    path: "/",
    name: "Home",
    component: () => import("@/views/Home/index.vue"),
    meta: { title: "主页", keepAlive: false },
    children: [
        {
            path: "",
            name: "homeDefault",
            component: () => import("@/views/Home/Default/index.vue"),
            meta: {
                title: "主页",
                keepAlive: true,
            },
        },
        {
            path: "/search",
            name: "search",
            component: () => import("@/views/Home/Search/index.vue"),
            meta: {
                title: "搜索结果",
                keepAlive: false,
            },
        },
    ],
};
