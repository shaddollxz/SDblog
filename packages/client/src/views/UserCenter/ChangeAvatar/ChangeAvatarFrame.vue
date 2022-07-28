<template>
    <div class="changeAvatarFrame gusto-flex-center" @click="$emit('update:isShow', false)">
        <h2>修改头像</h2>
        <div class="frameItemBox gusto-border" v-fill>
            <div
                class="gusto-frameBox"
                v-for="(frame, index) of $img.avatarFrame"
                @click.capture="choseFrame(index)"
            >
                <img :src="userStore.avatars.avatar || $img.akarin" alt="" />
                <img :src="frame" alt="" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store/user";
const userStore = useUserStore();
defineProps({
    isShow: {
        type: Boolean,
        default: false,
    },
});
defineEmits(["update:isShow"]);

function choseFrame(index: number) {
    userStore.updateUserInfo({ avatarFrame: index });
}
</script>

<style lang="scss" scoped>
.changeAvatarFrame {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    flex-direction: column;
    background-color: rgba(0, 0, 0, 0.8);
    .frameItemBox {
        width: 45%;
        height: max-content;
        box-sizing: border-box;
        padding: 2rem 3rem;
        gap: $gap-large;
        background-color: var(--color-bg-bland);
        > div {
            margin: 0.5rem 0;
            height: 6rem;
            width: 6rem;
        }
        @include mobile {
            width: 100%;
            padding: 2rem 1rem;
        }
    }
}
</style>
