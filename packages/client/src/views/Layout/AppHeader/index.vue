<template>
    <header class="global-header">
        <h1 class="canClick chuyuan" @click="router.push('/')" title="Quincy Is Watching You">
            0v0
            <span class="chuyuan">昆~</span>
        </h1>

        <Theme></Theme>

        <transition name="global-sideBar">
            <div class="sideBar" v-show="isShowSideBar">
                <Search @onChangeSideBarState="changeSideBarState"></Search>

                <UserBar @changeSideBarState="changeSideBarState"></UserBar>

                <HeaderNav
                    @onChangeSideBarState="changeSideBarState"
                    :isShowSideBar="isShowSideBar"
                ></HeaderNav>

                <div class="closeSideBar" @click="changeSideBarState">
                    <SvgIcon name="layout-close"></SvgIcon>
                </div>
            </div>
        </transition>

        <div class="openSideBar" @click="changeSideBarState">
            <SvgIcon name="blog-menu"></SvgIcon>
        </div>
    </header>
</template>

<script setup lang="ts">
import Search from "./Search.vue";
import UserBar from "./UserBar.vue";
import Theme from "./Theme.vue";
import HeaderNav from "./HeaderNav.vue";
import isMobile from "@/utils/isMobile";

const router = useRouter();

//todo 在打开时根据屏幕大小判断是否显示侧边栏 在pe端上点击导航栏按钮后调用该方法隐藏侧边栏 pc中不使用该方法
const isShowSideBar = ref(!isMobile);
function changeSideBarState() {
    if (isMobile) {
        isShowSideBar.value = !isShowSideBar.value;
    }
}
</script>

<style lang="scss">
.global-header {
    z-index: 99;
    position: fixed;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $gap-xxlarge * 2;
    box-sizing: border-box;
    width: 100%;
    padding: 0 3rem 0 4rem;
    background-color: $bg-header;
    color: $color-header;

    h1 {
        span {
            font-size: var(--fontsize-default);
        }
    }

    .sideBar {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 5rem;
        background-color: $bg-header;
        gap: $gap-xxlarge * 2;
        .search {
            width: 40rem;
        }
    }
    .openSideBar,
    .closeSideBar {
        display: none;
    }
    .svgIcon {
        width: var(--fontsize-xlarge);
    }

    @include mobile {
        padding: 1rem 3rem;
        .sideBar {
            --top: 2rem;
            position: absolute;
            top: 0;
            left: 0;
            flex-direction: column;
            width: 100%;
            height: 100vh;
            .search {
                order: 1;
                width: 75%;
                margin: var(--top) 3rem 2rem 0;
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
                top: var(--top);
                right: 0;
                display: block;
            }
        }
        .openSideBar {
            display: block;
            flex: 0 0 auto;
        }
    }
}
.global-sideBar-enter-active,
.global-sideBar-leave-active {
    transition: all 0.5s ease;
}

.global-sideBar-enter-from,
.global-sideBar-leave-to {
    opacity: 0;
    transform: translateX(-100%);
}
</style>
