<template>
    <div class="breadcrumb">
        <span>当前路径&nbsp;</span>
        <a v-for="path of panStore.currentPathFolder" @click="() => panStore.toThisPath(path.id)">
            {{ "/" + path.name }}
        </a>
    </div>
</template>

<script setup lang="ts">
import { usePanStore } from "@/store/pan";
const panStore = usePanStore();
</script>

<style lang="scss" scoped></style>
