<template>
    <div class="blog">
        <div class="content">
            <Left></Left>
            <Right :style="{ transform: !isMobile !== menuState ? null : 'translateX(100%)' }"></Right>

            <div class="menuBtn gusto-flex-center" @click="menuState = !menuState">
                <i class="iconfont icon-fenleimulu"></i>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Left from "./Left.vue";
import Right from "./Right.vue";
import isMobile from "@/utils/isMobile";
import { blogDetailApi } from "@apis";
import type { BlogDetailInfo } from "@blog/server";
const route = useRoute();

let markdownContent = ref("");
let replyCount = ref(0);
const blogDetail = shallowRef<BlogDetailInfo | null>(null);
provide("update:markdownContent", (value: string) => (markdownContent.value = value));
provide("markdownContent", markdownContent);
provide("update:replyCount", (value: number) => (replyCount.value = value));
provide("replyCount", replyCount);
provide("blogDetail", blogDetail);

onMounted(() => {
    blogDetailApi(route.params.blogId as string).then(({ data }) => {
        blogDetail.value = data;
        document.head.querySelector("title")!.innerText = data.title;
    });
});

let menuState = ref(false); // 手机端时控制显示菜单
</script>

<style lang="scss" scoped>
.blog {
    margin-left: var(--width-wife);
    margin-right: 2rem;
    width: calc(100% - var(--width-wife) - 2rem);
    .content {
        display: flex;
        justify-content: space-between;
        height: 100%; // 设置高度让子元素都是这个高度 这样menu才能sticky
        width: 100%;
        .left {
            width: calc(100vw - var(--width-wife) - 2rem - 20rem - 2rem);
            box-sizing: border-box;
            padding: 0 2rem 2rem;
            @include mobile {
                width: 100%;
                padding: 0;
            }
        }
        .right {
            @include mobile {
                z-index: 29;
                position: fixed;
                top: 0;
                bottom: 0;
                right: 0;
                height: 100%;
                background-color: var(--color-bg-bland);
                transition: 0.4s all;
                &:deep(.bar) {
                    margin-top: calc(var(--height-header) + 1rem);
                    .markdownMenu {
                        height: 33rem;
                    }
                }
            }
        }
        .menuBtn {
            z-index: 30;
            display: none;
            position: fixed;
            bottom: 4rem;
            right: 2.5rem;
            width: calc(var(--fontsize-xlarge) + 1rem);
            height: calc(var(--fontsize-xlarge) + 1rem);
            border-radius: 50%;
            box-shadow: 0 2px 8px 0 black;
            background-color: var(--color-bg-bland);

            .iconfont {
                font-size: var(--fontsize-xlarge);
                color: var(--color-text-theme);
            }
            @include mobile {
                display: flex;
            }
        }
    }
    @include mobile {
        overflow: hidden;
        margin: 0;
        width: 100%;
    }
}
</style>
