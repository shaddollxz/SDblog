<template>
    <div class="author">
        <div class="avatar gusto-avatarBox">
            <img :src="blogMsg?.author.avatar || $img.akarin" alt="" />
        </div>
        <div class="msg">
            <div class="authorMsg">
                <span>{{ blogMsg?.author.name }}</span>
                <span>{{ blogMsg?.author.email }}</span>
            </div>
            <div class="blogMsg">
                <i class="iconfont icon-calendar-v2-full" title="创作日期"></i>
                <span>
                    {{ $formatTime(blogMsg?.createdAt!, "/YYYY/-/MM/-/DD/ /HH/:/mm/ 周/W/") }}
                </span>
                <span>约{{ $formatNumber(blogMsg?.content!.length) }}字</span>
            </div>
            <div class="tags">
                <i class="iconfont icon-biaoqian" title="标签"></i>
                <div class="gusto-tagBox" v-for="tag of blogMsg?.tags">
                    <RouterLink :to="{ path: '/search', query: { tag: tag._id } }">
                        {{ tag.value }}
                    </RouterLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { BlogDetail_Inject } from "./types";
const blogMsg: BlogDetail_Inject = inject("blogDetail")!;
</script>

<style lang="scss" scoped>
.author {
    $height: 6rem;
    display: flex;
    align-content: center;
    height: $height;
    padding: 1rem 2rem;
    .avatar {
        flex: 0 0 auto;
        width: $height;
        height: $height;
        margin-right: 2rem;
    }
    .msg {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        i {
            font-size: var(--fontsize-default);
            margin-right: 0.4rem;
        }
        span {
            margin-right: 1.2rem;
        }
        .authorMsg {
            :nth-child(1) {
                color: var(--color-text-theme);
                font-weight: 600;
            }
            :nth-child(2) {
                margin: 0;
                font-family: "chuyuan";
                font-style: italic;
            }
        }
        .blogMsg {
            font-family: "chuyuan";
        }
        .tags {
            display: flex;
            align-items: center;
            .gusto-tagBox {
                margin-left: 0.2rem;
                --fontsize: var(--fontsize-tiny);
            }
        }
    }
    @media screen and (max-width: 750px) {
        padding: 0 0.6rem;
    }
}
</style>
