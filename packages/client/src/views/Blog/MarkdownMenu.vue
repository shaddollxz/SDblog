<template>
    <div class="markdownMenu">
        <p class="xingyan">目录</p>
        <div class="menu">
            <MarkdownMenuChild :menuData="menuTree"></MarkdownMenuChild>
        </div>
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
    border-radius: $border-r-big;
    background-color: var(--color-bg-bland);
    .menu {
        height: calc(100% - var(--fontsize-big) - 4rem);
        width: 100%;
        overflow-y: scroll;
        @include scrollBarSize("none");
    }
    p {
        height: var(--fontsize-big);
        margin: 2rem 0;
        font-size: var(--fontsize-big);
        font-weight: 600;
        color: var(--color-text-theme);
    }
}
</style>
