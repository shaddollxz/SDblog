export default <RouteItem>{
    path: "/arKnights",
    name: "arKnights",
    component: () => import("@views/ArKnights/index.vue"),
    meta: { title: "粥" },
    children: [
        {
            path: "recruit",
            name: "recruit",
            component: () => import("@views/ArKnights/Recruit/index.vue"),
            meta: { title: "卡池记录" },
        },
    ],
};
