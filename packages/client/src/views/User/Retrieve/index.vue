<template>
    <Frame>
        <template #box>
            <div class="emailBox">
                <div class="text">输入你的邮箱地址</div>
                <div class="email">
                    <CheckInput ref="email" :check="emailCheck" placeholder="电子邮箱"></CheckInput>
                    <CheckButton @onClick="sendEmail" :isCanClick="canSendEmail" :delay="60000">
                        发送验证码
                    </CheckButton>
                </div>
                <div v-show="isShowCodeBox" class="codeBox">
                    <input type="text" v-model="verifycode" placeholder="输入验证码" />
                </div>
            </div>
            <div class="text">输入新密码</div>
            <CheckInput ref="passWord" :ispwd="true" :check="passWordCheck" placeholder="新密码"></CheckInput>
            <div class="text">再次输入密码</div>
            <CheckInput
                ref="rePassWord"
                :ispwd="true"
                :check="rePassWordCheck"
                placeholder="二次密码"
            ></CheckInput>
            <CheckButton @onClick="changePassWord" :isCanClick="ispassAllCheck">修改密码</CheckButton>
        </template>
    </Frame>
</template>

<script setup lang="ts">
import Frame from "../Frame.vue";
import CheckButton from "@/components/CheckButton/index.vue";
import CheckInput from "@/components/CheckInput/CheckInput.vue";
import type { CheckRules } from "@/components/CheckInput";
import { changePassWordApi, sendRetrieveEmailApi } from "@apis";
import { useUserStore } from "@/store/user";
const userStore = useUserStore();

const router = useRouter();

const email = shallowRef<typeof CheckInput | null>(null);
const passWord = shallowRef<typeof CheckInput | null>(null);
const rePassWord = shallowRef<typeof CheckInput | null>(null);
const verifycode = ref("");

//todo 输入验证
const emailCheck: CheckRules[] = [
    ["notEmpty", null, "邮箱不能为空"],
    ["isEmail", null],
];
const passWordCheck: CheckRules[] = [
    ["notEmpty", null, "密码不能为空"],
    ["passWordLevel", 3, "密码等级不足"],
];
const rePassWordCheck: CheckRules[] = [[(value) => value == passWord.value?.passCheckData, "密码输入不一致"]];
const ispassAllCheck = computed(
    () =>
        !!email.value?.passCheckData &&
        !!verifycode.value &&
        !!passWord.value?.passCheckData &&
        !!rePassWord.value?.passCheckData
);
let isShowCodeBox = ref(false);
const canSendEmail = computed(() => !!email.value?.passCheckData); // 邮箱填写正确
function sendEmail() {
    sendRetrieveEmailApi(email.value!.passCheckData);
    isShowCodeBox.value = true;
}

//todo 修改密码并登录
function changePassWord() {
    changePassWordApi({
        email: email.value!.passCheckData,
        newPassWord: rePassWord.value!.passCheckData,
        verifycode: verifycode!.value,
    }).then(({ data }) => {
        userStore.refreshUserInfo(data.userData);
        router.push("/");
    });
}
</script>
