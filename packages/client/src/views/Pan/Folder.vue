<template>
    <div class="folder">
        <div class="item" v-show="!panStore.isRoot" @click="panStore.toUpperPath">
            <div class="left canClick" v-dragtarget="upperDropTargetOption">
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
                            <div class="options gusto-flex-center-col">
                                <EnsureButton
                                    :arrow="false"
                                    directive="be"
                                    text="确定删除该文件夹吗，其中的文件在三天内可以通过回收站找回"
                                    @onSure="() => panStore.removeFolder([item.name])"
                                >
                                    <span class="option">删除</span>
                                </EnsureButton>
                                <EnsureButton
                                    :arrow="false"
                                    directive="be"
                                    type="input"
                                    text=""
                                    :defaultValue="item.name"
                                    @onSure="(n) => panStore.renameFolder(item.name, n)"
                                >
                                    <span class="option">重命名</span>
                                </EnsureButton>
                            </div>
                        </template>
                    </Popover>
                    <SvgIcon name="pan-download"></SvgIcon>
                </div>
            </div>
        </template>
        <template v-for="(item, index) of folder.files" :key="item.hash">
            <div class="item fileItem">
                <div class="left" v-draggable="fileDragOption(item.name, item._id)">
                    <SvgIcon name="pan-file"></SvgIcon>
                    <div class="left">
                        <span>{{ item.name }}</span>
                        <span class="filesize">{{ $formatBit(item.size) }}</span>
                    </div>
                </div>
                <div class="right">
                    <Popover>
                        <SvgIcon name="public-menu"></SvgIcon>
                        <template #popup>
                            <div class="options gusto-flex-center-col">
                                <EnsureButton
                                    :arrow="false"
                                    directive="be"
                                    text="确定删除该文件吗，删除文件后三天内可以在回收站内找回"
                                    @onSure="() => panStore.removeFile(item._id)"
                                >
                                    <span class="option">删除</span>
                                </EnsureButton>
                                <EnsureButton
                                    :arrow="false"
                                    directive="be"
                                    type="input"
                                    text=""
                                    :defaultValue="item.name"
                                    @onSure="(n) => panStore.renameFile(item._id, n, index)"
                                >
                                    <span class="option">重命名</span>
                                </EnsureButton>
                            </div>
                        </template>
                    </Popover>
                    <SvgIcon name="pan-download"></SvgIcon>
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
import type { IsMulti } from "./inject";

const panStore = usePanStore();
const folder = toRef(panStore, "currentFolder");
const isMulti = inject<IsMulti>("isMulti")!;

// #region 拖放
const enum DragType {
    file,
    folder,
}
interface DropOption {
    type: DragType;
    name: string;
    id: string;
}
type DragOption = DropOption;
function folderDropTargetOption(name: string, id: string): VDragType.TargetOptions<DropOption> {
    return {
        onDrop(data) {
            if (data.type == DragType.folder && data.id != id) {
                panStore.moveFolderToNear(data.name, name);
            } else if (data.type == DragType.file) {
                panStore.moveFileTo(data.id, id);
            }
        },
    };
}
const upperDropTargetOption: VDragType.TargetOptions<DropOption> = {
    onDrop(data) {
        if (data.type == DragType.folder) {
            panStore.moveFolderToNear(data.name, "..");
        } else if (data.type == DragType.file) {
            panStore.moveFileTo(data.id, panStore.currentPathFolder.at(-2)!.id);
        }
    },
};
function fileDragOption(name: string, id: string): VDragType.DraggableOptions<DragOption> {
    return { data: { type: DragType.file, name, id }, draggable: true };
}
function folderDragOption(name: string, id: string): VDragType.DraggableOptions<DragOption> {
    return { data: { type: DragType.folder, name, id }, draggable: true };
}
// #endregion
</script>

<style lang="scss" scoped>
.folder {
    user-select: none;
    .item {
        display: flex;
        justify-content: space-between;
        gap: $gap-xxlarge;
        box-sizing: border-box;
        padding: $gap $gap-large;
        .left,
        .right {
            display: flex;
            align-items: center;
            gap: $gap;
        }
        .left {
            flex: 1;
            .filesize {
                font-size: var(--fontsize-small);
                align-self: flex-end;
            }
        }
    }
    .folderItem .left {
        align-items: center;
    }
}
.options {
    gap: $gap-big;
}
.option:hover,
.svgIcon:hover,
.left:hover {
    cursor: pointer;
    fill: var(--color-text-theme);
    color: var(--color-text-theme) !important;
}
.item:hover {
    background-color: var(--color-bg-bland);
}
</style>
