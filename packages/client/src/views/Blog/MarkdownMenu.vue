<template>
    <div class="markdownMenu">
        <p>目录</p>
        <div class="menu gusto-hiddenScrollBar">
            <MarkdownMenuChild :menuData="menuTree"></MarkdownMenuChild>
        </div>
        <i class="iconfont icon-xiala"></i>
    </div>
</template>

<script setup lang="ts">
import assert from "@/utils/assert";
import { isGroups, MenuTree } from "./MenuTree";
import MarkdownMenuChild from "./MarkdownMenuChild.vue";

const props = defineProps<{ html: string }>();

const menuTree = computed(() => {
    const tree = new MenuTree();
    const regexp = /<h(?<size>\d).*?id="(?<id>.+?)".*?>.*?<\/h.*?>/g;
    for (const { groups } of props.html.matchAll(regexp)) {
        assert(isGroups(groups));
        tree.insert(groups);
    }
    return tree;
});
</script>

<style lang="scss" scoped>
.markdownMenu {
    position: relative;
    box-sizing: border-box;
    padding: 1rem 0.8rem 3rem 2rem;
    border-radius: 0.5rem;
    background-color: var(--color-bg-bland);
    .menu {
        height: calc(100% - var(--fontsize-big) - 4rem);
        width: 100%;
        overflow-y: scroll;
    }
    p {
        height: var(--fontsize-big);
        margin: 2rem 0;
        font-family: "xingyan";
        font-size: var(--fontsize-big);
        font-weight: 600;
        color: var(--color-text-theme);
    }
    .iconfont {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        font-size: var(--fontsize-big);
        color: var(--color-text-theme);
        cursor: default;
    }
}
</style>
