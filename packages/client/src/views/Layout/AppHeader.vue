<template>
    <header>
        <h1 @click="$router.push('/')" title="Quincy Is Watching You">
            0v0
            <span>昆~</span>
        </h1>

        <Theme></Theme>
        <transition name="sideBar">
            <div class="sideBar" v-show="isShowSideBar">
                <Search></Search>

                <UserBar @changeSideBarState="changeSideBarState"></UserBar>

                <nav v-once>
                    <template v-for="nav of navlist">
                        <RouterLink :to="nav.link" custom v-slot="{ navigate }">
                            <div
                                @click="
                                    navigate();
                                    changeSideBarState();
                                "
                                role="link"
                            >
                                {{ nav.text }}
                            </div>
                        </RouterLink>
                    </template>

                    <!-- 退出登录 在pc下隐藏 -->
                    <div
                        class="logout"
                        v-if="userSotre.isLogin"
                        @click="userSotre.logout(), changeSideBarState()"
                    >
                        退出登录
                    </div>
                </nav>

                <div class="closeSideBar" @click="changeSideBarState">
                    <i class="iconfont icon-cuowutishi"></i>
                </div>
            </div>
        </transition>

        <div class="openSideBar" @click="changeSideBarState">
            <i class="iconfont icon-caidan"></i>
        </div>
    </header>
</template>

<script setup lang="ts">
import Search from "./Search.vue";
import UserBar from "./UserBar.vue";
import Theme from "./Theme.vue";
import isMobile from "@/utils/isMobile";
import { useUserStore } from "@/store/user";
const userSotre = useUserStore();

//todo 在打开时根据屏幕大小判断是否显示侧边栏 在pe端上点击导航栏按钮后调用该方法隐藏侧边栏 pc中不使用该方法
const isShowSideBar = ref(!isMobile);
function changeSideBarState() {
    if (isMobile) {
        isShowSideBar.value = !isShowSideBar.value;
    }
}

const navlist = [
    { text: "首页", link: "/" },
    { text: "留言", link: "/essay" },
    { text: "施工中", link: "/404" },
    { text: "关于", link: "/about" },
];
</script>

<style lang="scss" scoped>
header {
    z-index: 99;
    position: fixed;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    width: 100%;
    padding: 0 3rem 0 4rem;
    background-color: #2d333b; // header颜色固定
    color: #bebfc1;

    h1 {
        font-family: "chuyuan";
        cursor: pointer;
        span {
            font-family: "chuyuan";
            font-size: var(--fontsize-small);
        }
    }

    .sideBar {
        display: flex;
        justify-content: space-between;
        height: 5rem;
        background-color: #2d333b;
        gap: 2rem;
        align-items: center;
        .search {
            width: 30rem;
        }
        nav {
            display: flex;
            height: 100%;
            gap: 2rem;
            font-family: "xingyan";
            > div {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100%;
                line-height: 5rem; // 和header一样高
                font-size: var(--fontsize-big);
                padding: 0 2rem;
                cursor: pointer;
                &:hover {
                    color: var(--color-text-theme);
                    background-color: var(--color-bg-deep);
                }
            }
            .logout {
                display: none;
            }
        }
    }
    .openSideBar,
    .closeSideBar {
        display: none;
    }

    @media screen and (max-width: 750px) {
        padding: 1rem 3rem;
        .sideBar {
            position: absolute;
            top: 0;
            left: 0;
            flex-direction: column;
            width: 100%;
            height: 100vh;
            .search {
                order: 1;
                width: 80%;
                margin: 2rem 3rem 2rem 0;
            }
            nav {
                flex-direction: column;
                order: 3;
                width: 100%;
                height: 35rem;
                margin-bottom: 3rem;
                .logout {
                    display: flex !important;
                }
                > div {
                    flex: 1;
                    &:hover {
                        color: var(--color-text-theme);
                        background-color: #2d333b;
                    }
                }
                &::after {
                    content: "";
                    flex: 1;
                }
            }
            .loginBtn,
            .userBar {
                order: 2;
                flex: 0 0 auto;
            }
            .userBar {
                width: 10rem;
                height: 10rem;
                .avatar {
                    span {
                        font-size: var(--fontsize-big);
                    }
                }
            }
            .closeSideBar {
                position: absolute;
                top: 2rem; // 和.search的margintop相同
                right: 1rem;
                display: block;
                i {
                    font-size: var(--fontsize-large) !important;
                }
            }
        }
        .openSideBar {
            display: block;
            flex: 0 0 auto;
            i {
                font-size: var(--fontsize-xlarge) !important;
            }
        }
    }
}
.sideBar-enter-active,
.sideBar-leave-active {
    transition: all 0.5s ease;
}

.sideBar-enter-from,
.sideBar-leave-to {
    opacity: 0;
    transform: translateX(-100%);
}
</style>
