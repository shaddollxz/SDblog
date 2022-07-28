<template>
    <div class="folder">
        <div class="item" @click="panStore.toUpperPath">
            <div class="left" v-dragtarget="upperDropTargetOption">
                <SvgIcon name="pan-folder"></SvgIcon>
                <span>..</span>
            </div>
        </div>
        <template v-for="item of folder.folders" :key="item.id">
            <div class="item folderItem">
                <div
                    class="left"
                    @click="panStore.toInnerPath(item.id)"
                    v-draggable="folderDragOption(item.name, item.id)"
                    v-dragtarget="folderDropTargetOption(item.name, item.id)"
                >
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
                <div class="left" v-draggable="fileDragOption(item.name, item.hash)">
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
import type { VDragType } from "sdt3";

const panStore = usePanStore();
const folder = toRef(panStore, "currentFolder");

interface DropOption {
    type: "file" | "folder";
    name: string;
    id: string;
}
function folderDropTargetOption(name: string, id: string): VDragType.TargetOptions<DropOption> {
    return {
        onDrop(data) {
            if (data.type == "folder" && data.id != id) {
                panStore.moveFolderToNear(data.name, name);
            }
        },
    };
}
const upperDropTargetOption: VDragType.TargetOptions<DropOption> = {
    onDrop(data) {
        if (data.type == "folder") {
            panStore.moveFolderToNear(data.name, "..");
        }
    },
};

type DragOption = DropOption;
function fileDragOption(name: string, id: string): VDragType.DraggableOptions<DragOption> {
    return { data: { type: "file", name, id }, draggable: true };
}
function folderDragOption(name: string, id: string): VDragType.DraggableOptions<DragOption> {
    return { data: { type: "folder", name, id }, draggable: true };
}
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
            gap: $gap;
        }
        .left {
            flex: 1;
            cursor: pointer;
            &:hover {
                fill: var(--color-text-theme);
                color: var(--color-text-theme) !important;
            }
        }
    }
}
</style>
