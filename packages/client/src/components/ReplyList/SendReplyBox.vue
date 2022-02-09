<template>
    <div class="sendReplyBox">
        <div class="user" v-if="!userStore.isLogin">
            <div class="input">
                <span>id:</span>
                <CheckInput ref="name" :check="nameCheck"></CheckInput>
            </div>
            <div class="input">
                <span>email:</span>
                <CheckInput ref="email" :check="emailCheck"></CheckInput>
            </div>
        </div>
        <SendMarkdown
            ref="sendMarkdown"
            :isCanSend="isAllCheckPass"
            :delay="10000"
            @onSend="sendReply"
        ></SendMarkdown>
    </div>
</template>

<script setup lang="ts">
import SendMarkdown from "@/components/SendMarkdown/index.vue";
import CheckInput from "@/components/CheckInput/CheckInput.vue";
import type { CheckRules } from "@/components/CheckInput";
import type { Props } from "./index.vue";
import { Message } from "sdt3";
import { writeReplyApi } from "@apis";
import { useUserStore } from "@/store/user";
const userStore = useUserStore();

const emit = defineEmits(["refreshList"]);
const replyMainId = inject<Props["replyMainId"]>("replyMainId")!;
const type = inject<Props["type"]>("type")!;

//todo 验证游客评论需要的信息
const sendMarkdown = shallowRef<typeof SendMarkdown | null>(null);
const name = shallowRef<typeof CheckInput | null>(null);
const email = shallowRef<typeof CheckInput | null>(null);
const visitorInfo = computed(() => {
    return {
        name: name.value?.passCheckData,
        email: email.value?.passCheckData,
    };
});
const nameCheck: CheckRules[] = [["notEmpty", null, "用户名不能为空"]];
const emailCheck: CheckRules[] = [
    ["notEmpty", null, "邮箱不能为空"],
    ["isEmail", null],
];
const isAllCheckPass = computed(() =>
    userStore.isLogin
        ? !!sendMarkdown.value?.text
        : !!visitorInfo.value.name && !!visitorInfo.value.email && !!sendMarkdown.value?.text
);

//todo 发送博客的评论
function sendReply() {
    writeReplyApi({
        type,
        replyMainId,
        content: sendMarkdown.value!.text,
        replyTo: undefined,
        visitorInfo: visitorInfo.value,
    }).then(({ data }) => {
        Message.success("发送成功");
        sendMarkdown.value!.text = "";
        emit("refreshList", data);
    });
}
</script>

<style lang="scss" scoped>
.sendReplyBox {
    .user {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 65%;
        margin-bottom: 1.4rem;
        > div {
            margin-right: 1rem;
        }
        .input {
            span {
                font-family: "xingyan";
                font-size: var(--fontsize-big);
                font-weight: 600;
            }
        }
        @media screen and(max-width:750px) {
            width: 100%;
        }
    }
    .sendMarkdown {
        width: 100%;
        height: 35rem;
        max-height: 35rem;
        overflow: hidden;
        margin-bottom: 2rem;
        @media screen and (max-width: 750px) {
            height: 45rem;
            max-height: 45rem;
        }
    }
}
</style>
