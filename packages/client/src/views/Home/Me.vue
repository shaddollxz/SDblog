<template>
    <div class="me gusto-border gusto-flex-center">
        <div class="avatar gusto-avatarBox">
            <img :src="$img.admin" alt="" />
        </div>

        <div class="msgs gusto-flex-center">
            <div class="userInfo gusto-flex-center">
                <span>{{ detail.name }}</span>
                <span>shaddollxz@163.com</span>
            </div>
            <div class="blogInfo">
                <div>
                    <div>文章</div>
                    <div>{{ detail.blogCount }}</div>
                </div>
                <span>|</span>
                <div>
                    <div>标签</div>
                    <div>{{ tagStore.count }}</div>
                </div>
            </div>
        </div>

        <div class="icons" v-once>
            <a v-for="item in aboutMe" :href="item.link" :title="item.title" target="_blank">
                <i class="iconfont" :class="'icon-' + item.icon"></i>
            </a>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useTagStore } from "@/store/tags";
import { shaddollxzDetailApi } from "@apis";
import type { ShaddollxzInfo } from "@blog/server";
const tagStore = useTagStore();

let detail = shallowRef<Partial<ShaddollxzInfo>>({
    name: "shaddollxz",
    blogCount: 999,
});
onMounted(() => {
    shaddollxzDetailApi().then(({ data }) => {
        detail.value = data;
    });
});

const aboutMe = [
    {
        title: "bilibili",
        link: "https://space.bilibili.com/8196356",
        icon: "bilibili",
    },
    {
        title: "github",
        link: "https://github.com/shaddollxz",
        icon: "github",
    },
    {
        title: "steam",
        link: "https://steamcommunity.com/profiles/76561198416501855/",
        icon: "steam",
    },
    {
        title: "QQ",
        link: "",
        icon: "qq",
    },
];
</script>

<style lang="scss" scoped>
.me {
    box-sizing: border-box;
    padding: 1rem 1.25rem;
    flex-direction: column;
    gap: 1rem;
}
.avatar {
    margin: 0 auto;
    width: 40%;
}
.msgs {
    width: 80%;
    flex-direction: column;
    gap: 0.5rem;
    .userInfo {
        flex-direction: column;
        font-weight: 600;
        gap: 0.3rem;
        margin-bottom: 1rem;
        :first-child {
            color: var(--color-text-theme);
        }
    }
    .blogInfo {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        width: 100%;
        div {
            text-align: center;
            &:first-child {
                font-size: var(--fontsize-large);
                font-family: "chuyuan";
            }
            &:last-child {
                font-size: var(--fontsize-big);
                font-family: "chuyuan";
            }
        }
        span {
            font-weight: 900;
        }
    }
}
.icons {
    text-align: center;
    a {
        &::before {
            display: none;
        }
        &:hover {
            text-decoration: none;
        }
        i {
            margin: 0 1rem;
            &::before {
                font-size: var(--fontsize-large);
            }
        }
    }
}
</style>
