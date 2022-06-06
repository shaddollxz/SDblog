<template>
    <div class="sendReplyReplyBox">
        <div class="user" v-if="!userStore.isLogin">
            <div class="input gusto-flex-center">
                <span class="xingyan">id:</span>
                <CheckInput ref="name" :check="nameCheck"></CheckInput>
            </div>
            <div class="input gusto-flex-center">
                <span class="xingyan">email:</span>
                <CheckInput ref="email" :check="emailCheck"></CheckInput>
            </div>
        </div>
        <SendMarkdown
            ref="sendMarkdown"
            :placeholder="msgHeader"
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
import { writeReplyApi } from "@apis";
import { Message } from "sdt3";
import { useUserStore } from "@/store/user";
const userStore = useUserStore();

const props = defineProps({
    msgHeader: {
        type: String,
        default: "",
    },
    replyId: {
        type: String,
        default: null,
    },
    refreshList: {
        type: Function,
        default: () => () => {},
    },
    //! 如果在组件内用vif决定是否渲染会在nextTick时拿不到sendMarkdown 所以在外面决定组件渲染，组件内部通知外部关闭自己
    isShow: {
        type: Boolean,
        default: false,
    },
});
const emit = defineEmits(["update:isShow"]);
const replyMainId = inject<Props["replyMainId"]>("replyMainId")!;
const type = inject<Props["type"]>("type")!;

//todo 验证游客评论需要的信息
const sendMarkdown = shallowRef<InstanceType<typeof SendMarkdown> | null>(null);
const name = shallowRef<InstanceType<typeof CheckInput> | null>(null);
const email = shallowRef<InstanceType<typeof CheckInput> | null>(null);
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
    // 根据登录状态判断输入是否合格
    userStore.isLogin
        ? !!sendMarkdown.value?.text
        : !!visitorInfo.value.name && !!visitorInfo.value.email && !!sendMarkdown.value?.text
);
//! 默认关闭预览
nextTick(() => (sendMarkdown.value!.isPreview = false));

//todo 发送评论的评论
function sendReply() {
    writeReplyApi({
        replyMainId,
        content: props.msgHeader + sendMarkdown.value!.text,
        replyTo: props.replyId,
        visitorInfo: visitorInfo.value as any,
        type,
    }).then((res) => {
        emit("update:isShow", false);
        sendMarkdown.value!.text = "";
        Message.success("发送成功");
        props.refreshList(res.data);
    });
}
</script>

<style lang="scss" scoped>
.sendReplyReplyBox {
    margin-bottom: 1rem;
    .user {
        display: flex;
        margin-bottom: 1.4rem;
        .input {
            margin-right: 2rem;
            span {
                font-size: var(--fontsize-default);
                font-weight: 600;
                margin-right: 1rem;
            }
        }
    }
    .sendMarkdown {
        height: 15rem;
    }
}
</style>
