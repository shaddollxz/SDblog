export default <RouteItem>{
    path: "/writeBlog",
    name: "writeBlog",
    component: () => import("@views/WriteBlog/index.vue"),
    meta: {
        title: "写文章",
        needLogin: true,
        keepAlive: true,
        needAdmin: true,
    },
};
