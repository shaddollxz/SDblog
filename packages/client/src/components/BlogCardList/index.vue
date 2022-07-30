<template>
    <div class="blogCardList gusto-border gusto-flex-center-col">
        <template v-for="blogMsg of $props.blogList">
            <BlogCard :blogMsg="blogMsg"></BlogCard>
        </template>
    </div>
</template>

<script setup lang="ts">
import BlogCard from "./BlogCard.vue";
import type { BlogListItemInfo } from "@blog/server";

interface Props {
    blogList: BlogListItemInfo[];
}
defineProps<Props>();
</script>

<style lang="scss" scoped>
.blogCardList {
    box-sizing: border-box;
    padding: 1.4rem 2.4rem;
    background-color: var(--color-bg-bland);
    .blogCard {
        width: 100%;
    }
    > :last-child {
        border-bottom: none;
    }
}
</style>
