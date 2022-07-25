<template>
    <section class="blogCard">
        <LazyLoadBox :isReHidden="true" @onShow="onShow">
            <div class="msg">
                <div class="time">
                    <SvgIcon name="blog-clock"></SvgIcon>
                    <span>{{ $formatTime(props.blogMsg.createdAt!, "/YYYY/-/MM/-/DD/ /HH/:/mm/") }}</span>
                </div>

                <RouterLink :to="{ path: `/blog/${blogMsg._id}` }" custom v-slot="{ navigate }">
                    <h2
                        class="title gusto-limitTextLength canClick"
                        @click="navigate"
                        role="link"
                        :title="blogMsg.title"
                    >
                        {{ blogMsg.title }}
                    </h2>
                </RouterLink>

                <span class="summary gusto-limitTextRow" :title="blogMsg.description">
                    {{ blogMsg.description }}
                </span>
                <div class="foot">
                    <div>
                        <SvgIcon name="userCenter-person"></SvgIcon>
                        <span>{{ blogMsg?.author?.name }}</span>
                    </div>
                    <div>
                        <SvgIcon name="blog-like"></SvgIcon>
                        <span>{{ blogMsg.likes }}</span>
                    </div>
                    <div>
                        <SvgIcon name="blog-reply"></SvgIcon>
                        <span>{{ blogMsg.replyCount }}</span>
                    </div>
                    <div>
                        <span>约{{ $formatNumber(blogMsg.contentLength) }}字</span>
                    </div>
                </div>
                <div class="tags">
                    <SvgIcon name="blog-tag"></SvgIcon>
                    <div class="gusto-tagBox" v-for="tag of blogMsg.tags">
                        <RouterLink :to="{ path: '/search', query: { tag: tag._id } }">
                            {{ tag.value }}
                        </RouterLink>
                    </div>
                </div>
            </div>
            <div class="img">
                <img ref="headPic" alt="这里是头图" />
            </div>
            <div v-if="userStore.isAdmin" class="menu canClick" @click="showMenu = !showMenu">
                <SvgIcon name="blog-menu"></SvgIcon>
                <div v-show="showMenu" class="gusto-border gusto-flex-center">
                    <div class="canClick" @click="deleteBlog">
                        <SvgIcon name="public-delete"></SvgIcon>
                        <span>删除</span>
                    </div>
                    <div class="canClick" @click="editBlog">
                        <SvgIcon name="public-edit"></SvgIcon>
                        <span>修改</span>
                    </div>
                </div>
            </div>
        </LazyLoadBox>
    </section>
</template>

<script setup lang="ts">
import { Message, Random } from "sdt3";
import { deleteBlogApi } from "@apis";
import type { BlogListItemInfo } from "@blog/server";
import defaultHeadPic from "@img/blogHeadPic_default.jpg";
import staticPics from "virtual:staticPics";
import isMobile from "@/utils/isMobile";
import { useUserStore } from "@/store/user";
const router = useRouter();
const userStore = useUserStore();

interface Props {
    blogMsg: BlogListItemInfo;
}
const props = defineProps<Props>();

const headPic = ref<HTMLImageElement | null>(null);

let alreadyShow = false;
function errorHandle(this: HTMLImageElement) {
    this.src = defaultHeadPic;
    this.removeEventListener("error", errorHandle);
}
function onShow() {
    if (isMobile) return;

    if (!alreadyShow) {
        alreadyShow = true;
        if (props.blogMsg.headPic) {
            headPic.value!.src = props.blogMsg.headPic;
        } else {
            headPic.value!.src = Random.array(staticPics.headPic);
        }
        headPic.value!.addEventListener("error", errorHandle);
    }
}
onUnmounted(() => headPic.value?.removeEventListener("error", errorHandle));

let showMenu = ref(false);
function deleteBlog() {
    deleteBlogApi(props.blogMsg._id).then(() => {
        Message.success("删除成功");
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    });
}
function editBlog() {
    router.push("/writeBLog?edit=" + props.blogMsg._id);
}
</script>

<style lang="scss" scoped>
.blogCard {
    position: relative;
    box-sizing: border-box;
    padding: 2rem 1.6rem;
    border-bottom: 2px solid var(--color-border);
    .svgIcon {
        margin-right: 0.2rem;
        width: var(--fontsize-small);
        height: var(--fontsize-small);
    }
    .lazyLoadBox {
        min-height: 10rem;
        display: flex;
        align-items: center;
        .msg {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 40%;
            flex: 1;
            margin-right: 2rem;
            .time {
                font-size: var(--fontsize-small);
                span {
                    font-style: italic;
                }
            }
            .title {
                width: 100%;
                margin: 1.5rem 0;
                font-weight: bold;
                font-size: var(--fontsize-large);
                &:hover {
                    color: var(--color-text-theme);
                }
                a {
                    &::before {
                        height: 6px;
                    }
                }
            }
            .summary {
                width: 100%;
                max-height: 40%;
                flex: 0 0 auto;
                margin-bottom: 1rem;
                font-size: var(--fontsize-default);
            }
            .foot {
                display: flex;
                gap: 0.5rem;
                > div {
                    display: flex;
                    align-items: center;
                    > span {
                        font-size: var(--fontsize-small);
                        margin-right: 0.3rem;
                    }
                }
            }
            .tags {
                display: flex;
                align-items: center;
                margin-top: 0.4rem;
                .gusto-tagBox {
                    margin-left: 0.4rem;
                    --fontsize: var(--fontsize-tiny);
                }
            }
        }
        .img {
            flex: 0 0 auto;
            width: 19rem;
            @include scaleImage();
            img {
                border-radius: 0.5rem;
                width: 100%;
            }
        }
        .menu {
            position: absolute;
            top: -2rem;
            right: -2rem;
            > div {
                flex-direction: column;
                gap: 1rem;
                box-sizing: border-box;
                padding: 0.5rem 0.5rem;
                position: absolute;
                left: 50%;
                top: 100%;
                width: max-content;
                background-color: var(--color-bg-bland);
            }
        }
        @include mobile {
            .msg {
                margin: 0;
            }
            .img {
                display: none;
            }
            .menu {
                top: 1rem;
                > div {
                    left: 50%;
                    top: 3rem;
                    transform: translateX(-50%);
                }
            }
        }
    }
}
</style>
