<template>
    <div class="replyItem">
        <LazyLoadBox>
            <div class="head">
                <span class="time">
                    {{ $formatTime($props.replyMsg?.createdAt, "/YYYY/-/MM/-/DD/") }}
                </span>
                <span class="like">
                    <i class="iconfont icon-dianzan"></i>
                    <span>{{ $props.replyMsg?.likes }}</span>
                </span>
                <span class="link">回复于</span>
                <span class="link">
                    <a
                        href="javascript:void(0)"
                        @click="
                            $router.push(`/${$props.replyMsg?.type}/${$props.replyMsg?.replyMainId}#评论`)
                        "
                    >
                        {{ map[$props.replyMsg?.type] }}
                    </a>
                </span>
            </div>
            <div class="content">
                <Markdown :markdown="$props.replyMsg?.content"></Markdown>
            </div>
        </LazyLoadBox>
    </div>
</template>

<script setup lang="ts">
import Markdown from "@/components/Markdown/index.vue";
const props = defineProps({
    replyMsg: {
        type: Object,
        default: () => ({}),
    },
});

const map = {
    blog: "博客",
    essay: "随笔",
};
</script>

<style lang="scss" scoped>
.replyItem {
    .lazyLoadBox {
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
        .head {
            .time {
                font-size: var(--fontsize-small);
                font-style: italic;
                margin-right: 1rem;
            }
            .like {
                margin-right: 1rem;
                span {
                    font-size: var(--fontsize-small);
                }
            }
            .link {
                font-family: "chuyuan";
            }
            @include mobile {
                margin-left: 0.5rem;
            }
        }
        .content {
            background-color: var(--color-bg-bland);
            .markdown {
                padding: 0 1.5rem;
            }
        }
    }
}
</style>
