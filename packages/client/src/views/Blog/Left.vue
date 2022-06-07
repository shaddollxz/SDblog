<template>
    <div class="left">
        <h2 class="title">{{ blogDetail?.title }}</h2>
        <Author></Author>
        <Markdown ref="markdown" :markdown="blogDetail?.content!" :isLoading="true"></Markdown>
        <div class="end chuyuan gusto-flex-center">end</div>
        <p id="评论" class="reply xingyan">评论：</p>
        <ReplyList
            ref="replyList"
            :replyMainId="($route.params.blogId as string)"
            :type="ReplyEnum.blog"
        ></ReplyList>
    </div>
</template>

<script setup lang="ts">
import type { UpdateMarkdownContent, UpdateReplyCount, BlogDetail_Inject } from "./types";
import Author from "./Author.vue";
import Markdown from "@/components/Markdown/index.vue";
import ReplyList from "@/components/ReplyList/index.vue";
import { ReplyEnum } from "@blog/server";

const updateMarkdownCountent = inject<UpdateMarkdownContent>("update:markdownContent")!;
const updateReplyCount = inject<UpdateReplyCount>("update:replyCount")!;
const blogDetail = inject<BlogDetail_Inject>("blogDetail")!;

const markdown = shallowRef<InstanceType<typeof Markdown> | null>(null); // 获取解析后的字符串来解析为目录
const replyList = shallowRef<InstanceType<typeof ReplyList> | null>(null);

watch(
    () => markdown?.value?.html,
    (n) => updateMarkdownCountent(n ?? "")
);
watch(
    () => replyList?.value?.count,
    (n) => updateReplyCount(n ?? 0)
);
</script>

<style lang="scss" scoped>
.left {
    display: flex;
    flex-direction: column;
    justify-content: center;

    .title {
        font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
        font-size: var(--fontsize-xxlarge);
    }
    .author {
        width: 100%;
        margin-bottom: 1rem;
    }
    .end {
        position: relative;
        margin-top: 3rem;
        font-size: var(--fontsize-large);
        &::before {
            content: "";
            position: absolute;
            top: 50%;
            left: 20%;
            width: 20%;
            border-bottom: 1px solid var(--color-border);
        }
        &::after {
            content: "";
            position: absolute;
            top: 50%;
            right: 20%;
            width: 20%;
            border-bottom: 1px solid var(--color-border);
        }
    }
    .markdown {
        width: 100%;
    }
    .reply {
        font-size: var(--fontsize-xlarge);
    }
}
</style>
