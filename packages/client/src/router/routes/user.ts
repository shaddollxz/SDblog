export default <RouteItem>{
    path: "/user",
    name: "user",
    component: () => import("@views/User/index.vue"),
    meta: {
        title: "用户登录",
        keepAlive: false,
    },
    children: [
        {
            path: "login",
            name: "login",
            component: () => import("@views/User/Login/index.vue"),
            meta: { title: "登录" },
        },
        {
            path: "register",
            name: "register",
            component: () => import("@views/User/Register/index.vue"),
            meta: {
                title: "注册用户",
                keepAlive: false,
            },
        },
        {
            path: "retrieve",
            name: "retrieve",
            component: () => import("@views/User/Retrieve/index.vue"),
            meta: {
                title: "找回密码",
                keepAlive: false,
            },
        },
    ],
};
