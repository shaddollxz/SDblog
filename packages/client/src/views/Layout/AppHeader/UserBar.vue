<template>
    <div class="userBar gusto-flex-center">
        <div v-if="userStore.isLogin" class="avatar gusto-avatarBox canClick" @click="toUserCenter">
            <img :src="userStore.avatars.avatar || $img.akarin" alt="" title="用户中心" />
        </div>

        <div v-else class="loginBtn gusto-button" @click="toLogin" title="我也不知道登录有啥用">登录</div>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store/user";
const userStore = useUserStore();
const router = useRouter();

const emit = defineEmits(["changeSideBarState"]);

function toLogin() {
    emit("changeSideBarState");
    router.push({ path: "/user/login" });
}
function toUserCenter() {
    emit("changeSideBarState");
    router.push({ path: "/userCenter" });
}
</script>

<style lang="scss" scoped>
.avatar {
    height: calc($height-header * 0.85);
    width: calc($height-header * 0.85);
    transition: all 0.04s linear;
    &:hover {
        transform: scale(1.8);
        transform-origin: top;
    }
    @include mobile {
        height: 80%;
        width: 80%;
    }
}
.loginBtn {
    width: $height-header;
    border-width: 2px;
    &:hover {
        color: var(--color-text-theme);
        border-color: var(--color-text-theme);
    }
    @include mobile {
        width: 100%;
        padding: 0.8rem 1.8rem;
        font-size: var(--fontsize-big);
    }
}
</style>
