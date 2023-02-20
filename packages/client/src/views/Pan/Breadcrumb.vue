<template>
    <div class="breadcrumb">
        <span>位置：&nbsp;</span>
        <template v-for="path of panStore.currentPathFolder">
            <span>&nbsp;/&nbsp;</span>
            <a @click="() => panStore.toThisPath(path.id)">
                {{  path.name }}
            </a>
        </template>
    </div>
</template>

<script setup lang="ts">
import { usePanStore } from "@/store/pan";
const panStore = usePanStore();
</script>
