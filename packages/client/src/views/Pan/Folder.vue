<template>
    <div class="folder">
        <div class="item" @click="panStore.toUpperPath">
            <div class="left">
                <SvgIcon name="pan-folder"></SvgIcon>
                <span>..</span>
            </div>
        </div>
        <div
            class="item"
            v-for="item of folder.folders"
            :key="item.id"
            @click="panStore.toInnerPath(item.id)"
        >
            <div class="left">
                <SvgIcon name="pan-folder"></SvgIcon>
                <span>{{ item.name }}</span>
            </div>
            <div class="right">
                <SvgIcon name="public-delete"></SvgIcon>
            </div>
        </div>
        <div class="item" v-for="item of folder.files" :key="item.hash">
            <div class="left">
                <SvgIcon name="pan-file"></SvgIcon>
                <span>{{ item.name }}</span>
            </div>
            <div class="right">
                <SvgIcon name="public-delete"></SvgIcon>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { usePanStore } from "@/store/pan";

const panStore = usePanStore();
const folder = toRef(panStore, "currentFolder");
// watch(folder, (n) => {
//     console.log(n.folders);
// });
</script>

<style lang="scss" scoped>
.folder {
    .item {
        display: flex;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 0.4rem 1rem;
        .left {
            flex: 1;
        }
        .right {
        }
    }
}
</style>
