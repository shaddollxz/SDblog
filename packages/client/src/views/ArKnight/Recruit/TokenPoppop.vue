<template>
    <div class="tokenPoppop gusto-border gusto-flex-center-col">
        <p>选择服务器</p>
        <div class="btns"></div>
        <p>输入token</p>
        <textarea v-model="_token"></textarea>
        <div class="btns gusto-flex-center">
            <CheckButton :isCanClick="!!token" @click="emit('onEnsure', token, channelId)">确定</CheckButton>
            <CheckButton isCanClick @click="emit('onExit')">取消</CheckButton>
            <CheckButton class="errorBtn" isCanClick>清除登录信息</CheckButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { AKStorage } from "@/storages/arKnight";
import CheckButton from "@/components/CheckButton/index.vue";

interface Emits {
    (n: "onEnsure", token: string, channelId: number): void;
    (n: "onExit"): void;
}
const emit = defineEmits<Emits>();

const _token = ref("");
const token = ref("");
const channelId = ref(1);
watch(_token, (n, o) => {
    //todo 格式化token
    token.value = n;
});

onMounted(() => {
    const savedToken = AKStorage.getItem("userData");
    if (savedToken) {
        token.value = savedToken.ak_token;
        channelId.value = savedToken.channelId;
    }
});
</script>

<style lang="scss" scoped>
.tokenPoppop {
    padding: $gap-big $gap-xlarge;
    textarea {
        font-size: var(--fontsize-default);
    }
    .btns {
        gap: $gap-big;
        .errorBtn {
            background-color: var(--color-error);
            color: var(--color-error-text);
        }
    }
}
</style>
