<template>
    <div class="right">
        <div class="bar">
            <MarkdownMenu :html="markdownContent"></MarkdownMenu>

            <div class="tools">
                <div @click="changeLikeStatus">
                    <SvgIcon v-show="likeStatus" name="blog-like_block" class="liked"></SvgIcon>
                    <SvgIcon v-show="!likeStatus" name="blog-like"></SvgIcon>
                    {{ likes }}
                </div>
                <a href="#评论">
                    <div>
                        <SvgIcon name="blog-reply"></SvgIcon>
                        {{ replyCount }}
                    </div>
                </a>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import MarkdownMenu from "./MarkdownMenu.vue";
import { likeBlogApi } from "@apis";
import type { MarkdownContent, BlogDetail_Inject, ReplyCount } from "./types";
import { onBeforeRouteLeave } from "vue-router";
const route = useRoute();

let markdownContent = inject<MarkdownContent>("markdownContent")!;
let replyCount = inject<ReplyCount>("replyCount")!;
let blogDetail = inject<BlogDetail_Inject>("blogDetail")!;

let likes = ref(0);
watch(blogDetail, () => (likes.value = blogDetail.value.likes));

//todo 点赞的样式改变和记录
let likeStatus = ref(false);
function changeLikeStatus() {
    likeStatus.value = !likeStatus.value;
    if (likeStatus.value) {
        ++likes.value;
    } else {
        --likes.value;
    }
}

//todo 离开页面或关闭浏览器时判断是否点赞并向后端传输
function sendLikes() {
    if (likeStatus.value) {
        likeBlogApi(route.params.blogId as string);
    }
}
onMounted(() => window.addEventListener("beforeunload", sendLikes));
onBeforeUnmount(() => window.removeEventListener("beforeunload", sendLikes));
onBeforeRouteLeave((to, from) => sendLikes());
</script>

<style lang="scss" scoped>
.right {
    $menuWith: 20rem;
    width: $menuWith;
    .bar {
        position: sticky;
        top: calc($height-header + 3rem); // 被固定时的位置
        margin-top: calc($height-header + 10rem); // 初始未知
        .markdownMenu {
            width: $menuWith;
            height: calc(100vh - $height-header - 11rem);
        }

        .tools {
            padding: 1.5rem;
            display: flex;
            justify-content: space-evenly;
            align-items: center;
            div {
                width: 4rem;
                height: 4rem;
                border-radius: 50%;
                border: 1px solid var(--color-border);
                background-color: var(--color-bg-bland);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                font-size: var(--fontsize-small);
            }
            .svgIcon {
                width: var(--fontsize-big);
                height: var(--fontsize-big);
            }
            .liked {
                fill: var(--color-text-theme);
            }
            a {
                &::before {
                    display: none;
                }
                &:hover {
                    color: var(--color-text-default) !important;
                    text-decoration: none;
                }
            }
        }
    }
}
</style>
