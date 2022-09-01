<template>
    <div class="folder">
        <div class="item" v-show="!panStore.isRoot" @click="() => (isMulti ? null : panStore.toUpperPath())">
            <CheckBox v-hidden="false"></CheckBox>
            <div class="left canClick" v-dragtarget="upperDropTargetOption">
                <SvgIcon name="pan-folder"></SvgIcon>
                <span>..</span>
            </div>
        </div>
        <template v-for="item of folder.folders" :key="item.id">
            <div class="item folderItem">
                <CheckBox
                    v-hidden="isMulti"
                    @onCheck="(state) => folderStateChange(state, item.id, item.name)"
                ></CheckBox>
                <div
                    class="left"
                    @click="() => (isMulti ? null : panStore.toInnerPath(item.id))"
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
                    <SvgIcon name="pan-download" @click="() => downloadFolder(item.name, item.id)"></SvgIcon>
                </div>
            </div>
        </template>
        <template v-for="(item, index) of folder.files" :key="item.hash">
            <div class="item fileItem">
                <CheckBox
                    v-hidden="isMulti"
                    @onCheck="(state) => fileStateChange(state, item.hash, item.name, item._id)"
                ></CheckBox>
                <div class="left" v-draggable="fileDragOption(item.name, item._id)">
                    <SvgIcon name="pan-file"></SvgIcon>
                    <div class="fileMsg">
                        <span>{{ item.name }}</span>
                        <span class="filesize">{{ $formatBit(item.size) }}</span>
                        <div class="desciption gusto-limitTextLength" :title="item.desciption">
                            {{ item.desciption }}
                        </div>
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
                                    @onSure="
                                        (n) => panStore.editFileMsg(item._id, n, index, EditFileTypeEnum.name)
                                    "
                                >
                                    <span class="option">重命名</span>
                                </EnsureButton>
                                <EnsureButton
                                    :arrow="false"
                                    directive="be"
                                    type="input"
                                    text=""
                                    :defaultValue="item.desciption"
                                    @onSure="
                                        (n) => panStore.editFileMsg(item._id, n, index, EditFileTypeEnum.desc)
                                    "
                                >
                                    <span class="option">文件描述</span>
                                </EnsureButton>
                            </div>
                        </template>
                    </Popover>
                    <SvgIcon name="pan-download" @click="() => downloadFile(item.hash, item.name)"></SvgIcon>
                </div>
            </div>
        </template>
        <NoData v-show="!folder.folders?.length && !folder.files?.length"></NoData>
    </div>
</template>

<script setup lang="ts">
import EnsureButton from "@/components/EnsureButton/index.vue";
import NoData from "@/components/NoData/index.vue";
import Popover from "@/components/Popover/index.vue";
import { EditFileTypeEnum, usePanStore } from "@/store/pan";
import { downloadWithFetch } from "@/utils/download";
import { downloadFileApi } from "@apis";
import { DownloadFileTypeEnum } from "@blog/server";
import type { VDragType } from "sdt3";
import { Message } from "sdt3";
import { fileStateChange, folderStateChange, isMulti } from "./inject";

const panStore = usePanStore();
const folder = toRef(panStore, "currentFolder");

// #region 单文件或文件夹下载
async function downloadFile(
    hash: string,
    name: string,
    type: DownloadFileTypeEnum = DownloadFileTypeEnum.file
) {
    Message.success("开始下载文件：" + name);
    const res = await downloadFileApi({ hash, type: type ?? DownloadFileTypeEnum.file });
    downloadWithFetch(name, res);
    //* 下面是进度条的监听 但是浏览器本来就会记录 不如不要了
    // const { reader, size } = await downloadWithFetch(name, res);
    // if (reader) {
    //     const interval = window.setInterval(async () => {
    //         const { done, value } = await reader.read();
    //         // value是已下载量 size是总大小
    //         if (done) {
    //             window.clearInterval(interval);
    //         }
    //     }, 800);
    // }
}
async function downloadFolder(name: string, id: string) {
    const intervalFunc = await panStore.zipFolder({ folders: [{ name, id }] });
    const interval = window.setInterval(async () => {
        const { data } = await intervalFunc();
        if (data.hash) {
            window.clearInterval(interval);
            downloadFile(data.hash, name + ".zip", DownloadFileTypeEnum.folder);
        }
    }, 800);
}
// #endregion

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
        align-items: center;
        gap: $gap-xlarge;
        box-sizing: border-box;
        padding: $gap $gap-large;
        .checkBox {
            flex: 0 0 auto;
        }
        .left,
        .right {
            display: flex;
            align-items: center;
            gap: $gap;
        }
        .left {
            flex: 1;
        }
        .fileMsg {
            display: flex;
            align-items: center;
            gap: $gap;
            .desciption,
            .filesize {
                font-size: var(--fontsize-small);
                align-self: flex-end;
            }
            .desciption {
                margin-left: $gap-big;
                max-width: 35rem;
            }
        }
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
.noData {
    background: none;
}
</style>
