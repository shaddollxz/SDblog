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
                <!-- <div class="codeBox" v-show="isShowCodeBox"> -->
                <div class="codeBox">
                    <input type="text" v-model="verifycode" placeholder="输入验证码" />
                </div>
            </div>
            <div class="text">创建密码</div>
            <CheckInput ref="passWord" :ispwd="true" :check="passWordCheck" placeholder="密码"></CheckInput>
            <div class="text">创建用户名</div>
            <CheckInput ref="name" :check="nameCheck" placeholder="用户名"></CheckInput>
            <CheckButton @onClick="register" :isCanClick="ispassAllCheck">注册账号</CheckButton>
        </template>
        <template #tips>
            <span>已有账号？</span>
            <RouterLink to="/user/login">账号登录</RouterLink>
        </template>
    </Frame>
</template>

<script setup lang="ts">
import Frame from "../Frame.vue";
import CheckButton from "@/components/CheckButton/index.vue";
import CheckInput from "@/components/CheckInput/CheckInput.vue";
import type { CheckRules } from "@/components/CheckInput";
import { Message } from "sdt3";
import { sendRegisterEmailApi, registerApi } from "@apis";
const router = useRouter();

//todo 输入验证
const nameCheck: CheckRules[] = [
    ["notEmpty", null, "用户名不能为空"],
    ["maxLength", 8, "用户名不能超过八个字符"],
];
const emailCheck: CheckRules[] = [
    ["notEmpty", null, "邮箱不能为空"],
    ["isEmail", null],
];
const passWordCheck: CheckRules[] = [
    ["notEmpty", null, "密码不能为空"],
    ["passWordLevel", 3, "密码等级不足"],
];

//todo 验证结果
const name = shallowRef<InstanceType<typeof CheckInput> | null>(null);
const email = shallowRef<InstanceType<typeof CheckInput> | null>(null);
const passWord = shallowRef<InstanceType<typeof CheckInput> | null>(null);
const verifycode = ref("");
const formData = computed(() => {
    return {
        name: name.value?.passCheckData,
        email: email.value?.passCheckData,
        passWord: passWord.value?.passCheckData,
        verifycode: verifycode.value,
    };
});

//todo 是否通过所有验证
const ispassAllCheck = computed(
    () =>
        !!formData.value.verifycode &&
        !!formData.value.name &&
        !!formData.value.email &&
        !!formData.value.passWord
);

//todo 注册
let isShowCodeBox = ref(false);
const canSendEmail = computed(() => !!formData.value.email); // 邮箱填写正确

function sendEmail() {
    sendRegisterEmailApi(formData.value.email!);
    isShowCodeBox.value = true;
}

function register() {
    if (ispassAllCheck.value) {
        registerApi(formData.value as any).then(() => {
            Message.success("注册成功，即将跳转至登录页面", { duration: 1300 });
            setTimeout(() => {
                router.push("/login");
            }, 1500);
        });
    }
}
</script>
