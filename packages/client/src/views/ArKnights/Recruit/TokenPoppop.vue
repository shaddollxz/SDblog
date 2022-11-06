<template>
    <div class="tokenPoppop gusto-border gusto-flex-center-col">
        <p>输入账号标识符</p>
        <p>账号标识符用来区分不同账号的抽卡信息</p>
        <input type="text" v-model="flag" />
        <p>当前本机存储的账号信息（点击切换）</p>
        <p
            v-for="userFlag of userFlags"
            @click="() => changeCurrentFlag(userFlag)"
            :class="{ chosed: userFlag == flag }"
        >
            {{ userFlag }}
        </p>
        <p>选择服务器</p>
        <div class="btns">
            <div class="gusto-button" @click="channelId = 1" :class="{ chosed: channelId == 1 }">官服</div>
            <div class="gusto-button" @click="channelId = 2" :class="{ chosed: channelId == 2 }">B服</div>
        </div>
        <p>输入token</p>
        <textarea v-model="_token"></textarea>
        <div class="btns gusto-flex-center">
            <CheckButton :isCanClick="!!token" @click="emit('onEnsure', token, channelId, flag)">
                确定
            </CheckButton>
            <CheckButton isCanClick @click="emit('onExit')">取消</CheckButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { AKStorage } from "@/storages/arKnights";
import CheckButton from "@/components/CheckButton/index.vue";

interface Emits {
    (n: "onEnsure", token: string, channelId: number, flag: string): void;
    (n: "onExit"): void;
}
const emit = defineEmits<Emits>();

const _token = ref(""); // 输入的token
const token = ref(""); // 格式化后的token
const flag = ref(""); // 账号标识符
const channelId = ref(1); // 服务器
watch(_token, (n, o) => {
    //todo 格式化token
    token.value = n;
});

const userFlags = shallowRef<string[]>([]);
onMounted(() => {
    const userData = AKStorage.getItem("userData");
    const currentFlag = AKStorage.getItem("currentFlag");
    if (currentFlag && userData && userData[currentFlag]) {
        _token.value = userData[currentFlag].ak_token;
        channelId.value = userData[currentFlag].channelId;
        flag.value = currentFlag;
        userFlags.value = Object.keys(userData);
    }
});
function changeCurrentFlag(newFlag: string) {
    const currentFlag = AKStorage.getItem("currentFlag");
    if (newFlag == currentFlag) return;
    const userData = AKStorage.getItem("userData");
    if (userData && userData[newFlag]) {
        _token.value = userData[newFlag].ak_token;
        channelId.value = userData[newFlag].channelId;
        flag.value = newFlag;
    }
}
function onEnsure() {}
</script>

<style lang="scss" scoped>
.tokenPoppop {
    padding: $gap-big $gap-xlarge;
    background-color: var(--color-bg-deep);
    textarea {
        font-size: var(--fontsize-default);
    }
    .btns {
        gap: $gap-big;
        .chosed {
            background-color: var(--color-blue);
            color: var(--color-blue-8);
        }
        .errorBtn {
            background-color: var(--color-red);
            color: var(--color-red-8);
        }
    }
}
</style>
