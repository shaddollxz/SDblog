<template>
    <ul class="markdownMenuChild" v-if="menuData">
        <li v-for="menu of menuData">
            <a :href="'#' + menu.id">{{ menu.id }}</a>
            <MarkdownMenuChild v-if="menu.child" :menuData="menu.child"></MarkdownMenuChild>
        </li>
    </ul>
</template>

<script setup lang="ts">
import type { MenuTree } from "./MenuTree";

type Props = { menuData: MenuTree };
defineProps<Props>();
</script>

<style lang="scss" scoped>
.markdownMenuChild {
    font-family: "chuyuan";
    li {
        margin: 0.35rem 1.35rem;
        margin-right: 0;
    }
}
</style>
