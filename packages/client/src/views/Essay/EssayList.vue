<template>
    <div class="essayList">
        <template v-for="item of $props.essayList" :key="item._id">
            <EssayItem :essayData="item"></EssayItem>
        </template>
    </div>
</template>

<script setup lang="ts">
import EssayItem from "./EssayItem.vue";
import type { EssayInfo } from "@blog/server";

type Props = {
    essayList: EssayInfo[];
};
const props = defineProps<Props>();
</script>

<style lang="scss" scoped>
.essayList {
    width: 90%;
    .essayItem {
        margin: 1rem;
    }
    @include mobile {
        width: 100%;
        .essayItem {
            margin: 0 0 1rem 0;
        }
    }
}
</style>
