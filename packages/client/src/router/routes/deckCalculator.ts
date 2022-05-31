export default <RouteItem>{
    path: "/deckCalculator",
    name: "deckCalculator",
    component: () => import("@views/DeckCalculator/index.vue"),
    meta: {
        title: "卡手率计算器",
        keepAlive: true,
    },
};
