export default <RouteItem>{
    path: "/userCenter",
    name: "userCenter",
    component: () => import("@views/UserCenter/index.vue"),
    meta: {
        title: "个人中心",
        needLogin: true,
        keepAlive: false,
    },
    children: [
        {
            path: "",
            name: "userCenterDefault",
            component: () => import("@views/UserCenter/UserMsg/index.vue"),
            meta: {
                title: "个人中心",
                needLogin: true,
                keepAlive: false,
            },
        },
        {
            path: "avatar",
            name: "avatar",
            component: () => import("@views/UserCenter/ChangeAvatar/index.vue"),
            meta: {
                title: "个人中心-修改头像",
                needLogin: true,
                keepAlive: false,
            },
        },
        {
            path: "reply",
            name: "userReply",
            component: () => import("@views/UserCenter/Replys/index.vue"),
            meta: {
                title: "个人中心-评论列表",
                needLogin: true,
                keepAlive: false,
            },
        },
    ],
};
