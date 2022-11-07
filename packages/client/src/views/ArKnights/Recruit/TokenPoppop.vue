<template>
    <div class="tokenPoppop gusto-border gusto-flex-center-col">
        <div class="block gusto-flex-center-col">
            <p>账号</p>
            <p>用来区分不同账号的抽卡信息</p>
            <div class="btns gusto-flex-center">
                <div
                    v-for="userFlag of userFlags"
                    @click="() => changeCurrentFlag(userFlag)"
                    class="gusto-button"
                    :class="{ chosed: userFlag == currentUserFlag }"
                >
                    {{ userFlag }}
                </div>
                <div class="gusto-button" v-show="!isAdding" @click="addNewUserData">+</div>
                <input v-show="isAdding" type="text" v-model="inputFlag" />
            </div>
        </div>
        <div class="block gusto-flex-center-col">
            <p>选择服务器</p>
            <div class="btns gusto-flex-center">
                <div class="gusto-button" @click="channelId = 1" :class="{ chosed: channelId == 1 }">
                    官服
                </div>
                <div class="gusto-button" @click="channelId = 2" :class="{ chosed: channelId == 2 }">B服</div>
            </div>
        </div>
        <div class="block gusto-flex-center-col">
            <p>输入token</p>
            <textarea v-model="token" @input="onInput"></textarea>
        </div>
        <div class="block tips gusto-flex-center-col">
            <div>
                <p>关于获取token：</p>
                <div>
                    <span>token首先需要到</span>
                    <a href="https://ak.hypergryph.com" target="_blank">鹰角官网</a>
                    <span>登录</span>
                </div>
                <div>
                    <span>再通过以下链接获取：</span>
                    <a href="https://web-api.hypergryph.com/account/info/hg" target="_blank">官服</a>
                    &nbsp;
                    <a href="https://web-api.hypergryph.com/account/info/ak-b" target="_blank">B服</a>
                </div>
            </div>
            <div>
                <p>关于token的安全性：</p>
                <div>这里只提供抽卡数据的整理和保存</div>
                <div>不会收集任何用户登录信息</div>
                <div>
                    可以随时到
                    <a href="https://ak.hypergryph.com/user/home">官网</a>
                    清除token
                </div>
            </div>
        </div>
        <div class="block btns gusto-flex-center">
            <CheckButton
                :isCanClick="!!token && !!channelId && (!!currentUserFlag || !!inputFlag)"
                @click="emit('onEnsure', token, channelId, inputFlag || currentUserFlag)"
            >
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

const token = ref(""); // 格式化后的token
const currentUserFlag = ref(""); // 账号标识符
const channelId = ref(1); // 服务器

function onInput(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    let content = target.value;
    content = content.match(/"content":"(.+?)"/)?.[1] ?? content;
    target.value = content;
    token.value = content;
}

const userFlags = shallowRef<string[]>([]);
onMounted(() => {
    const userData = AKStorage.getItem("userData");
    const currentFlag = AKStorage.getItem("currentFlag");
    if (currentFlag && userData && userData[currentFlag]) {
        channelId.value = userData[currentFlag].channelId;
        console.log(channelId.value);
        currentUserFlag.value = currentFlag;
        userFlags.value = Object.keys(userData);
        token.value = userData[currentFlag].ak_token;
    }
});
function changeCurrentFlag(newFlag: string) {
    if (newFlag == currentUserFlag.value) return;
    const userData = AKStorage.getItem("userData");
    if (userData && userData[newFlag]) {
        channelId.value = userData[newFlag].channelId;
        currentUserFlag.value = newFlag;
        token.value = userData[newFlag].ak_token;
    }
}
const isAdding = ref(false);
const inputFlag = ref("");
function addNewUserData() {
    token.value = "";
    inputFlag.value = "";
    isAdding.value = true;
}
</script>

<style lang="scss" scoped>
.tokenPoppop {
    justify-content: space-between;
    gap: $gap-large;
    padding: $gap-large $gap-xlarge;
    background-color: var(--color-bg-deep);
    @include scrollBarSize("thin");
    a {
        color: var(--color-blue);
    }
    p {
        margin: $gap-big 0;
    }
    .block {
        width: 100%;
        textarea {
            font-size: var(--fontsize-default);
            width: 80%;
            min-height: 4rem;
        }
    }
    .tips {
        gap: $gap;
        text-align: center;
        padding-bottom: $gap-big;
        & > div > div {
            margin-bottom: $gap;
        }
    }
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
    input {
        max-width: 6rem;
    }
}
</style>
