<template>
    <Frame>
        <template #box>
            <div class="text">电子邮箱：</div>
            <CheckInput ref="email" :check="emailCheck" placeholder="电子邮箱"></CheckInput>
            <div class="text">
                密码：
                <RouterLink to="/user/retrieve">找回密码</RouterLink>
            </div>
            <CheckInput ref="passWord" :check="passWordCheck" :ispwd="true" placeholder="密码"></CheckInput>
            <CheckButton @onClick="login" :isCanClick="ispassAllCheck">登录</CheckButton>
        </template>
        <template #tips>
            <span>没有账号？</span>
            <RouterLink to="/user/register">注册账号</RouterLink>
        </template>
    </Frame>
</template>

<script setup lang="ts">
import Frame from "../Frame.vue";
import CheckButton from "@/components/CheckButton/index.vue";
import CheckInput from "@/components/CheckInput/CheckInput.vue";
import type { CheckRules } from "@/components/CheckInput";
import { useUserStore } from "@/store/user";
const userStore = useUserStore();
const router = useRouter();

//todo 输入验证
const emailCheck: CheckRules[] = [
    ["notEmpty", null, "邮箱不能为空"],
    ["isEmail", null],
];
const passWordCheck: CheckRules[] = [["notEmpty", null, "密码不能为空"]];
//todo 验证结果
const email = shallowRef<typeof CheckInput | null>(null);
const passWord = shallowRef<typeof CheckInput | null>(null);
const formData = computed(() => {
    return {
        email: email.value?.passCheckData,
        passWord: passWord.value?.passCheckData,
    };
});
// 是否通过所有验证
const ispassAllCheck = computed(() => formData.value.email && !!formData.value.passWord);

//todo 登录
function login() {
    if (ispassAllCheck.value) {
        userStore.login(formData.value).then(() => {
            setTimeout(() => {
                router.go(-1);
            }, 800);
        });
    }
}
</script>
