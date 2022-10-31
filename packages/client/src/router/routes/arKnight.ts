export default <RouteItem>{
    path: "/arKnight",
    name: "arKnight",
    component: () => import("@views/ArKnight/index.vue"),
    meta: { title: "粥" },
    children: [
        {
            path: "recruit",
            name: "recruit",
            component: () => import("@views/ArKnight/Recruit/index.vue"),
            meta: { title: "卡池记录" },
        },
    ],
};
