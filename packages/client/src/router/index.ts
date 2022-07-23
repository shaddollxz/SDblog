import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { useUserStore } from "../store/user";
import { Message } from "sdt3";

const routes: RouteItem[] = [];
const modules = import.meta.glob<{ default: RouteItem }>("./routes/*.ts", { eager: true });
for (const route in modules) {
    routes.push(modules[route].default);
}

const router = createRouter({
    history: createWebHistory(),
    routes: routes as RouteRecordRaw[],
    scrollBehavior: () => ({ top: 0 }),
});

router.beforeEach((to, from, next) => {
    const userStore = useUserStore();
    // todo 需要管理员才能进入的页面
    if (to.meta.needAdmin && !userStore.isAdmin) {
        next("/404");
        return true;
    }
    //todo 需要登录才能进入的页面
    if (to.meta.needLogin && !userStore.isLogin) {
        next("/user/login");
        Message.error("请登录后再尝试进入");
        return true;
    }
    //todo 修改title
    document.head.querySelector("title")!.innerText = to.meta.title;

    next();
    return true;
});

export default router;
