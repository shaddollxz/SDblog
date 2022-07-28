<template>
    <div class="folder">
        <div class="item" @click="panStore.toUpperPath">
            <div class="left">
                <SvgIcon name="pan-folder"></SvgIcon>
                <span>..</span>
            </div>
        </div>
        <template v-for="item of folder.folders" :key="item.id">
            <div class="item folderItem">
                <div class="left" @click="panStore.toInnerPath(item.id)">
                    <SvgIcon name="pan-folder"></SvgIcon>
                    <span>{{ item.name }}</span>
                </div>
                <div class="right">
                    <Popover>
                        <SvgIcon name="public-menu"></SvgIcon>
                        <template #popup>
                            <div>重命名</div>
                        </template>
                    </Popover>
                    <SvgIcon name="pan-download"></SvgIcon>
                    <EnsureButton
                        directive="be"
                        text="确定删除该文件夹吗"
                        @onSure="() => panStore.removeFolder([item.name])"
                    >
                        <SvgIcon name="public-delete"></SvgIcon>
                    </EnsureButton>
                </div>
            </div>
        </template>
        <template v-for="item of folder.files" :key="item.hash">
            <div class="item fileItem">
                <div class="left">
                    <SvgIcon name="pan-file"></SvgIcon>
                    <span>{{ item.name }}</span>
                </div>
                <div class="right">
                    <Popover>
                        <SvgIcon name="public-menu"></SvgIcon>
                        <template #popup>
                            <div>重命名</div>
                        </template>
                    </Popover>
                    <SvgIcon name="pan-download"></SvgIcon>
                    <EnsureButton
                        directive="be"
                        text="确定删除该文件吗"
                        @onSure="() => panStore.removeFile(item._id)"
                    >
                        <SvgIcon name="public-delete"></SvgIcon>
                    </EnsureButton>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import EnsureButton from "@/components/EnsureButton/index.vue";
import Popover from "@/components/Popover/index.vue";
import { usePanStore } from "@/store/pan";

const panStore = usePanStore();
const folder = toRef(panStore, "currentFolder");
</script>

<style lang="scss" scoped>
.folder {
    user-select: none;
    .item {
        display: flex;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 0.4rem 1rem;
        .left,
        .right {
            display: flex;
            align-items: center;
            gap: 0.4rem;
        }
        .left {
            flex: 1;
        }
    }
}
</style>
