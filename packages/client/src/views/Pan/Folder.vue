<template>
    <div class="folder">
        <div class="item">
            <div class="left">
                <SvgIcon name="pan-folder"></SvgIcon>
                <span>..</span>
            </div>
        </div>
        <template v-show="folder.folders?.length">
            <div class="item" v-for="item of folder.folders" @click="panStore.toInnerPath(item.id)">
                <div class="left">
                    <SvgIcon name="pan-folder"></SvgIcon>
                    <span>{{ item.name }}</span>
                </div>
                <div class="right">
                    <SvgIcon name="public-delete"></SvgIcon>
                </div>
            </div>
        </template>
        <template v-show="folder.files?.length">
            <div class="item" v-for="item of folder.files">
                <div class="left">
                    <SvgIcon name="pan-file"></SvgIcon>
                    <span>{{ item.name }}</span>
                </div>
                <div class="right">
                    <SvgIcon name="public-delete"></SvgIcon>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { usePanStore } from "@/store/pan";

const panStore = usePanStore();
const folder = toRef(panStore, "currentFolder");
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
