<template>
    <div class="essayItem gusto-border">
        <LazyLoadBox>
            <div class="avatar gusto-frameBox">
                <img :src="essayData.author.avatar || $img.akarin" alt="" />
                <img :src="$img.avatarFrame[essayData.author.avatarFrame]" alt="" />
            </div>

            <div class="content">
                <div class="msg chuyuan">
                    <div class="name">
                        <span>{{ essayData.author.name }}</span>
                        <span>{{ essayData.author.email }}</span>
                    </div>
                    <div class="time">
                        {{ $formatTime(essayData.createdAt, "/MM/-/DD/ /HH/:/mm/") }}
                    </div>
                </div>

                <Markdown :markdown="essayData.content"></Markdown>

                <div class="tools">
                    <div @click="liked">
                        <SvgIcon v-show="isDianzan" name="blog-like_block"></SvgIcon>
                        <SvgIcon v-show="!isDianzan" name="blog-like"></SvgIcon>
                        {{ like }}
                    </div>
                    <div @click="isShowReply = !isShowReply">
                        <SvgIcon name="blog-reply"></SvgIcon>
                        {{ essayData.replyCount }}
                    </div>
                </div>

                <EnsureButton
                    class="delete"
                    v-if="userStore.authorityCheck(AuthorityEnum.admin)"
                    @onSure="deleteEssay"
                    text="确定删除吗"
                >
                    <SvgIcon name="public-delete"></SvgIcon>
                </EnsureButton>
            </div>
        </LazyLoadBox>
        <ReplyList v-if="isShowReply" :replyMainId="essayData._id" :type="ReplyEnum.essay"></ReplyList>
    </div>
</template>

<script setup lang="ts">
import EnsureButton from "@/components/EnsureButton/index.vue";
import Markdown from "@/components/Markdown/index.vue";
import { useUserStore } from "@/store/user";
import { deleteEssayApi, likeEssayApi } from "@apis";
import type { EssayInfo } from "@blog/server";
import { ReplyEnum, AuthorityEnum } from "@blog/server";
import { Message } from "sdt3";
import { onBeforeRouteLeave } from "vue-router";
const ReplyList = defineAsyncComponent(() => import("@/components/ReplyList/index.vue"));

const userStore = useUserStore();
const route = useRoute();
type Props = { essayData: EssayInfo };
const props = defineProps<Props>();
interface Emits {
    (n: "onDelete", data: any): void;
}
const emit = defineEmits<Emits>();

let isShowReply = ref(false);

let isDianzan = ref(false);
let like = toRef(props.essayData, "likes");
function liked() {
    if (isDianzan.value) {
        like.value--;
    } else {
        like.value++;
    }
    isDianzan.value = !isDianzan.value;
}
function sendLikes() {
    if (isDianzan.value) {
        likeEssayApi(props.essayData._id);
    }
}
onMounted(() => window.addEventListener("beforeunload", sendLikes));
onBeforeUnmount(() => window.removeEventListener("beforeunload", sendLikes));
onBeforeRouteLeave(() => sendLikes());

function deleteEssay() {
    deleteEssayApi(props.essayData._id, (route?.query?.page as string) ?? "1").then(({ data }) => {
        Message.success("删除成功");
        emit("onDelete", data);
    });
}
</script>

<style lang="scss" scoped>
.essayItem {
    width: 100%;
    box-sizing: border-box;
    padding: 2rem 2rem;

    @include mobile {
        padding: 1rem;
    }
    &:deep(.replyList) {
        padding-top: 1rem;
        border-top: 1px solid var(--color-border);
        margin: 2rem 0 !important;
        .sendReplyBox {
            .sendMarkdown {
                height: 18rem;
            }
        }
    }
}
.lazyLoadBox {
    width: 100%;
    display: flex;
}
.avatar {
    flex: 0 0 auto;
    margin-right: 2rem;
    height: 5rem;
    width: 5rem;
}
.content {
    width: calc(100% - 7rem);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;

    .msg {
        .name {
            :first-child {
                color: var(--color-text-theme);
                font-weight: 600;
                font-size: var(--fontsize-big);
            }
            :last-child {
                margin-left: 1rem;
            }
            @include mobile {
                span {
                    display: block;
                    margin: 0 !important;
                }
            }
        }
    }

    :deep(.markdown) {
        flex: 0 1 auto;
        width: 100%;
        .markdownContent {
            box-sizing: border-box;
            padding: 0.1rem 1.5rem;
            width: 100%;
            p {
                margin: 0.4rem 0;
            }
        }
    }

    .tools {
        flex: 0 0 auto;
        display: flex;
        div {
            font-size: var(--fontsize-small);
            margin-right: 2rem;
            cursor: pointer;
            .svgIcon {
                width: var(--fontsize-small);
            }
        }
    }
    .delete {
        position: absolute;
        top: 0;
        right: 0;
    }
}
</style>
