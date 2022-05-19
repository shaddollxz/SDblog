<template>
    <section class="blogCard">
        <LazyLoadBox :isReHidden="true" @onShow="onShow">
            <div class="msg">
                <div class="time">
                    <i class="iconfont icon-calendar-v2-full"></i>
                    <span>{{ $formatTime(props.blogMsg.createdAt!, "/YYYY/-/MM/-/DD/ /HH/:/mm/") }}</span>
                </div>

                <RouterLink :to="{ path: `/blog/${blogMsg._id}` }" custom v-slot="{ navigate }">
                    <h2
                        class="title gusto-limitTextLength"
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
                        <i class="iconfont icon-zuozhe"></i>
                        <span>{{ blogMsg?.author?.name }}</span>
                    </div>
                    <div>
                        <i class="iconfont icon-dianzan"></i>
                        <span>{{ blogMsg.likes }}</span>
                    </div>
                    <div>
                        <i class="iconfont icon-kuaisuhuifu"></i>
                        <span>{{ blogMsg.replyCount }}</span>
                    </div>
                    <div>
                        <span>约{{ $formatNumber(blogMsg.contentLength) }}字</span>
                    </div>
                </div>
                <div class="tags">
                    <i class="iconfont icon-biaoqian"></i>
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
            <div v-if="userStore.isAdmin" class="menu" @click="showMenu = !showMenu">
                <i class="iconfont icon-caidan1"></i>
                <div v-show="showMenu" class="gusto-border gusto-flex-center">
                    <div @click="deleteBlog">
                        <i class="iconfont icon-shanchu"></i>
                        <span>删除</span>
                    </div>
                    <div @click="editBlog">
                        <i class="iconfont icon-bianji"></i>
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
import headPics from "virtual:headPics";
import isMobile from "@/utils/isMobile";
import { useUserStore } from "@/store/user";
const router = useRouter();
const userStore = useUserStore();

interface Props {
    blogMsg: BlogListItemInfo;
}
const props = defineProps<Props>();
console.log(props.blogMsg);
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
            headPic.value!.src = Random.array(headPics);
        }
        headPic.value!.addEventListener("error", errorHandle);
    }
}

let showMenu = ref(false);
function deleteBlog() {
    deleteBlogApi(props.blogMsg._id).then(() => {
        Message.success("删除成功");
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
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 40%;
            flex: 1;
            margin-right: 2rem;
            .time {
                font-size: var(--fontsize-small);
                i {
                    margin-right: 0.2rem;
                    font-size: var(--fontsize-default) !important;
                }
                span {
                    font-style: italic;
                }
            }
            .title {
                width: 100%;
                margin: 1.5rem 0;
                font-weight: bold;
                font-size: var(--fontsize-large);
                cursor: pointer;
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
                line-height: 1.7rem;
            }
            .foot {
                display: flex;
                gap: 0.5rem;
                > div {
                    line-height: 1.5rem;
                    display: flex;
                    align-items: center;
                    &:last-child {
                        margin: 0;
                    }
                    i {
                        font-size: var(--fontsize-default);
                    }
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
            transition: all 0.3s;
            img {
                border-radius: 0.5rem;
                width: 100%;
                height: auto;
            }
            &:hover {
                transform: scale(110%);
            }
        }
        .menu {
            position: absolute;
            top: -2rem;
            right: -2rem;
            cursor: pointer;
            i {
                font-size: var(--fontsize-big);
            }
            > div {
                flex-direction: column;
                box-sizing: border-box;
                padding: 0.5rem 0.5rem;
                position: absolute;
                left: 50%;
                top: 100%;
                width: max-content;
                gap: 1rem;
                background-color: var(--color-bg-bland);
                > div {
                    cursor: pointer;
                }
                i {
                    font-weight: 600;
                }
            }
        }
        @media screen and (max-width: 750px) {
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
