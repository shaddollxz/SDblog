<template>
    <section class="blogCard">
        <LazyLoadBox isReHidden @onShow="onShow">
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
            <Popover class="menu" v-if="userStore.isAdmin">
                <SvgIcon class="canClick" name="public-menu"></SvgIcon>
                <template #popup>
                    <div class="menuPopup gusto-flex-center-col">
                        <EnsureButton text="确定删除吗" @onSure="deleteBlog">
                            <div class="canClick gusto-flex-center">
                                <SvgIcon name="public-delete"></SvgIcon>
                                <div>删除</div>
                            </div>
                        </EnsureButton>
                        <div class="canClick gusto-flex-center" @click="editBlog">
                            <SvgIcon name="public-edit"></SvgIcon>
                            <div>修改</div>
                        </div>
                    </div>
                </template>
            </Popover>
        </LazyLoadBox>
    </section>
</template>

<script setup lang="ts">
import Popover from "@/components/Popover/index.vue";
import EnsureButton from "@/components/EnsureButton/index.vue";
import { useUserStore } from "@/store/user";
import isMobile from "@/utils/isMobile";
import { deleteBlogApi } from "@apis";
import type { BlogListItemInfo } from "@blog/server";
import defaultHeadPic from "@img/blogHeadPic_default.jpg";
import { Message, Random } from "sdt3";
import staticPics from "virtual:staticPics";

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
    .lazyLoadBox {
        min-height: 10rem;
        display: flex;
        align-items: center;
        .msg {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 40%;
            margin-right: 2rem;
            .svgIcon {
                margin-right: 0.2rem;
                width: var(--fontsize-small);
            }
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
                gap: $gap;
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
                margin-top: $gap;
                .gusto-tagBox {
                    margin-left: $gap;
                    --fontsize: var(--fontsize-tiny);
                }
            }
        }
        .img {
            flex: 0 0 auto;
            width: 19rem;
            @include scaleImage();
            img {
                border-radius: $border-r-big;
                width: 100%;
            }
        }
        .menu {
            position: absolute;
            top: -2rem;
            right: -2rem;
        }
        .menuPopup {
            gap: $gap-big;
            .svgIcon {
                width: var(--fontsize-default);
            }
            .gusto-flex-center {
                gap: $gap;
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
