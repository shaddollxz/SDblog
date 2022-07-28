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
                            <div class="msg chuyuan">{{ detail.author.email }}</div>
                            <div class="msg">
                                {{ $formatTime(detail.createdAt, "/YYYY/-/MM/-/DD/ /HH/:/mm/") }}
                            </div>
                        </div>
                        <span class="content">
                            <Markdown :markdown="detail.content"></Markdown>
                        </span>
                    </div>
                    <div class="foot">
                        <div class="msg reply canClick" @click="replyIt = !replyIt">
                            <SvgIcon name="blog-reply"></SvgIcon>
                            <span class="canClick">回复</span>
                        </div>
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
    --AD: 5rem; // 头像框直径
    --ADC: 4rem; // 子回复的头像框直径
    --Move: 4rem; // 子回复相较父回复的右移距离
    border-top: 1px solid var(--color-border);
    .main {
        display: flex;
        box-sizing: border-box;
        padding-top: 1rem;
        .avatar {
            flex: 0 0 auto;
            height: var(--AD);
            width: var(--AD);
            margin-right: 2rem;
        }
        .right {
            width: 100%;
            box-sizing: border-box;
            padding: 1rem;
            padding-top: 0;
            .msg {
                display: flex;
                align-items: center;
                margin-right: 0.8rem;
                font-size: var(--fontsize-small);
                .svgIcon {
                    width: var(--fontsize-small);
                    height: var(--fontsize-small);
                }
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
                        font-style: italic;
                    }
                }
                .content {
                    margin: 1rem 0;
                    &:deep(.markdown) {
                        padding: 1px 0;
                        margin: 0;
                    }
                    .markdown {
                        border-radius: $border-r-big;
                    }
                }
            }
            .foot {
                display: flex;
                .reply {
                    &:hover {
                        color: var(--color-text-theme);
                        .svgIcon {
                            fill: var(--color-text-theme);
                        }
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
                width: var(--ADC);
                height: var(--ADC);
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
            margin-left: var(--Move);
            .sendReplyReplyBox {
                width: 100vw;
                transform: translateX(calc(-1 * var(--Move))); // 和marginleft一致
            }
        }
    }
}
</style>
