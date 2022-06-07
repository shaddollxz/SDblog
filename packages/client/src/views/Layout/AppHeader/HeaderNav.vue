<template>
    <nav class="navlist xingyan" v-once>
        <template v-for="nav of navlist">
            <template v-if="nav.children">
                <div class="navItem dropdown gusto-flex-center">
                    <span>
                        {{ nav.text }}
                    </span>
                    <div class="dropBox" v-for="item of nav.children">
                        <RouterLink :to="item.link" custom v-slot="{ navigate }">
                            <div
                                class="dropItem gusto-flex-center"
                                @click="() => (navigate(), emit('onChangeSideBarState'))"
                            >
                                {{ item.text }}
                            </div>
                        </RouterLink>
                    </div>
                </div>
            </template>

            <template v-else>
                <RouterLink :to="nav.link" custom v-slot="{ navigate }">
                    <div
                        class="navItem gusto-flex-center"
                        @click="() => (navigate(), emit('onChangeSideBarState'))"
                    >
                        <span>{{ nav.text }}</span>
                    </div>
                </RouterLink>
            </template>
        </template>

        <!-- 手机端使用的 在pc下隐藏 -->
        <div
            class="logout"
            v-if="userSotre.isLogin"
            @click="() => (userSotre.logout(), emit('onChangeSideBarState'))"
        >
            退出登录
        </div>
    </nav>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store/user";

const userSotre = useUserStore();

interface Props {
    isShowSideBar: boolean;
}
interface Emits {
    (n: "onChangeSideBarState"): void;
}
defineProps<Props>();
const emit = defineEmits<Emits>();

const navlist = [
    { text: "首页", link: "/" },
    { text: "留言", link: "/essay" },
    { text: "小工具", children: [{ text: "卡手率计算器", link: "/deckCalculator" }] },
    { text: "关于", link: "/about" },
];
</script>

<style lang="scss" scoped>
.navlist {
    display: flex;
    height: 100%;
    gap: 2rem;
    .navItem {
        height: 100%;
        line-height: $height-header;
        font-size: var(--fontsize-big);
        padding: 0 2rem;
        cursor: pointer;
        &:hover {
            color: var(--color-text-theme);
            background-color: var(--color-bg-deep);
        }
        span {
            cursor: pointer;
        }
    }
    .logout {
        display: none;
    }
    @include mobile {
        flex-direction: column;
        order: 3;
        width: 100%;
        height: 35rem;
        margin-bottom: 3rem;
        .logout {
            display: flex !important;
        }
        .navItem {
            flex: 1;
            padding: 0;
            &:hover {
                color: var(--color-text-theme);
                background-color: $bg-header;
            }
        }
        &::after {
            content: "";
            flex: 1;
        }
    }
}
.dropdown {
    position: relative;
    &:hover {
        .dropBox {
            display: block;
        }
    }
    .dropBox {
        display: none;
        position: absolute;
        top: $height-header;
        left: -2rem;
        right: -2rem;
        border: 1px solid var(--color-border);
        border-top: none;
        background-color: var(--color-bg-deep);
        font-size: var(--fontsize-default);
        .dropItem {
            height: calc($height-header / 1.2);
            box-sizing: border-box;
            padding: 0 1rem;
            border-bottom: 1px solid var(--color-border);
        }
    }
    @include mobile {
        display: flex;
        flex-direction: column;

        .dropBox {
            position: unset;
            border: none;
            background-color: $bg-header;
            width: 100%;
            .dropItem {
                border: none;
            }
        }
    }
}
</style>
