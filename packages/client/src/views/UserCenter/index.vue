<template>
    <div class="userCenter gusto-flex-center">
        <nav class="gusto-border xingyan">
            <template v-for="item of navList">
                <RouterLink :to="item.path" custom v-slot="{ navigate }">
                    <div @click="navigate" role="link">
                        <i class="iconfont" :class="'icon-' + item.icon"></i>
                        <span>{{ item.title }}</span>
                    </div>
                </RouterLink>
            </template>
            <div v-if="userStore.isAdmin" @click="$router.push('/writeBlog')">
                <i class="iconfont icon-yongyan"></i>
                <span>写博客</span>
            </div>
            <div @click="userStore.logout(), $router.push('/')">
                <i class="iconfont icon-tuichudenglu"></i>
                <span>退出登录</span>
            </div>
        </nav>

        <router-view v-slot="{ Component }">
            <transition name="userCenterView">
                <component :is="Component" />
            </transition>
        </router-view>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store/user";
const userStore = useUserStore();
//? 不需要管理员权限的功能
const navList = [
    { title: "个人信息", path: "/userCenter", icon: "user" },
    { title: "修改头像", path: "/userCenter/avatar", icon: "bianji" },
    { title: "评论列表", path: "/userCenter/reply", icon: "kuaisuhuifu" },
];
</script>

<style lang="scss" scoped>
.userCenter {
    height: calc(100vh - $height-header - 2rem);
    max-height: 100rem;
    margin: calc($height-header + 2rem) $width-wife 0;
    gap: 2rem;
    nav {
        height: 100%;
        flex: 0 0 auto;
        box-sizing: border-box;
        padding: 1rem 2rem;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        font-size: var(--fontsize-big);
        background-color: var(--color-bg-bland);
        div,
        span,
        i {
            cursor: pointer;
        }
        div {
            width: 90%;
            padding: 0.5rem 1rem;
            border-bottom: 1px solid var(--color-border);
            i {
                font-size: var(--fontsize-large);
                margin-right: 1rem;
            }
            &:hover {
                color: var(--color-text-theme);
            }
        }
    }
    section {
        flex: 1;
        height: 100%;
        box-sizing: border-box;
        padding: 4rem 2rem;
    }
    @include mobile {
        height: max-content;
        margin: 0;
        flex-direction: column;
        border-bottom: 1px solid var(--color-border);
        nav {
            flex-direction: row;
            justify-content: start;
            width: 100%;
            overflow-x: scroll;
            border: none;
            div {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                border: none;
                i {
                    margin: 0;
                }
                span {
                    white-space: nowrap;
                }
            }
        }
        section {
            width: 100%;
        }
    }
}
// .userCenterView-enter-active,
// .userCenterView-leave-active {
//     transition: all 10s cubic-bezier(0.55, 0, 0.1, 1);
// }
// .userCenterView-leave-from,
// .userCenterView-enter-to {
//     opacity: 1;
//     transform: translateX(-30px);
// }
// .userCenterView-leave-to,
// .userCenterView-enter-from {
//     opacity: 0;
//     transform: translateX(30px);
// }
</style>
