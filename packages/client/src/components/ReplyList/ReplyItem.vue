<template>
    <div class="replyItem" :class="{ isChild }">
        <LazyLoadBox>
            <div class="main">
                <div class="avatar gusto-avatarBox">
                    <img :src="detail.author.avatar || $img.akarin" alt="" />
                </div>
                <div class="right">
                    <div class="head">
                        <div class="top">
                            <div class="msg">{{ detail.author.name }}</div>
                            <div class="msg">{{ detail.author.email }}</div>
                        </div>
                        <span class="content">
                            <Markdown :markdown="detail.content"></Markdown>
                        </span>
                    </div>
                    <div class="foot">
                        <div class="msg">
                            {{ $formatTime(detail.createdAt, "/YYYY/-/MM/-/DD/ /HH/:/mm/:/ss/") }}
                        </div>
                        <div class="msg reply canClick" @click="replyIt = !replyIt">回复</div>
                    </div>
                </div>
            </div>
            <SendReplyReplyBox
                v-if="replyIt"
                v-model:isShow="replyIt"
                :replyId="isChild ? replyId : detail._id"
                :msgHeader="msgHeader"
                v-bind="$attrs"
            ></SendReplyReplyBox>

            <template v-for="children of detail.children" :key="children._id">
                <ReplyItem
                    :isChild="true"
                    :detail="children"
                    :replyId="detail._id"
                    v-bind="$attrs"
                ></ReplyItem>
            </template>
        </LazyLoadBox>
    </div>
</template>

<script setup lang="ts">
import SendReplyReplyBox from "./SendReplyReplyBox.vue";
import Markdown from "@/components/Markdown/index.vue";
const props = defineProps({
    detail: {
        type: Object,
        default: {
            _id: "",
            content: "", //内容
            author: {
                name: "", // 发送人id
                email: "", // 邮箱
                avatar: "", // 头像
            },
            createdAt: "", // 发送时间
        },
    },
    isChild: {
        type: Boolean,
        default: false,
    },
    replyId: {
        type: String,
        default: "",
    },
});

let replyIt = ref(false);
let msgHeader = ref("回复给 @" + props.detail.author.name + "：");
</script>

<style lang="scss" scoped>
.replyItem {
    border-top: 1px solid var(--color-border);
    .main {
        display: flex;
        box-sizing: border-box;
        padding-top: 1rem;
        .avatar {
            flex: 0 0 auto;
            height: 5rem;
            width: 5rem;
            margin-right: 2rem;
        }
        .right {
            width: 100%;
            box-sizing: border-box;
            padding: 1rem;
            padding-top: 0;
            .msg {
                margin-right: 0.8rem;
                font-size: var(--fontsize-small);
            }
            .head {
                display: flex;
                flex-direction: column;
                .top {
                    display: flex;
                    font-weight: 600;
                    :nth-child(1) {
                        color: var(--color-text-theme);
                        font-weight: 600;
                    }
                    :nth-child(2) {
                        font-family: "chuyuan";
                        font-style: italic;
                    }
                }
                .content {
                    margin: 1rem 0;
                    &:deep(.markdown) {
                        padding: 1px 1rem;
                        margin: 0;
                    }
                    .markdown {
                        border-radius: 0.5rem;
                    }
                }
            }
            .foot {
                display: flex;
                .reply {
                    &:hover {
                        color: var(--color-text-theme);
                    }
                }
            }
        }
    }
    &.isChild {
        margin-left: 7.3rem;
        border: none;
        .main {
            .avatar {
                width: 4rem;
                height: 4rem;
                margin-right: 1rem;
            }
        }
    }
    @include mobile {
        .main {
            .avatar {
                margin-right: 1rem;
            }
        }
        &.isChild {
            margin-left: 4rem;
            .sendReplyReplyBox {
                width: 100vw;
                transform: translateX(-4rem); // 和marginleft一致
            }
        }
    }
}
</style>
