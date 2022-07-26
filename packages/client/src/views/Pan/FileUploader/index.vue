<template>
    <div class="fileUploader gusto-border">
        <div class="header">
            <div class="gusto-button" @click="choseFiles">
                <SvgIcon name="pan-choseFile"></SvgIcon>
                <span>选择文件</span>
            </div>
            <div class="gusto-button" @click="upload">
                <SvgIcon name="public-upload"></SvgIcon>
                <span>上传</span>
            </div>
        </div>
        <div class="uploader gusto-border" v-dragtarget="dropOption">
            <div class="tip gusto-flex-center" v-show="!chosedFiles.files.length">
                <p>同时支持拖放文件到此处</p>
                <p>最多选择10个文件</p>
            </div>
            <ul class="chosedFileList">
                <ChosedFileItem
                    v-for="file of chosedFiles.files"
                    :file="file"
                    :key="file.name"
                    @onRemove="removeFile"
                ></ChosedFileItem>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { LocalFiles } from "sdt3";
import type { VDragType } from "sdt3";
import { PostMessage } from "./worker";
import { usePanStore } from "@/store/pan";
import ChosedFileItem from "./ChosedFileItem.vue";

const panStore = usePanStore();

const chosedFiles = reactive(new LocalFiles({ count: 10 }));
function choseFiles() {
    chosedFiles.getFile();
}
function removeFile(file: File) {
    chosedFiles.files.splice(
        chosedFiles.files.findIndex((item) => item == file),
        1
    );
}
const dropOption: VDragType.TargetOptions = {
    onDrop(_, e) {
        e.stopPropagation();
        chosedFiles.append(e.dataTransfer!.files);
    },
    onDragenter(_, e) {
        e.stopPropagation();
        (e.target as HTMLDivElement).classList.add("uploader_target");
    },
    onDragleave(_, e) {
        e.stopPropagation();
        (e.target as HTMLDivElement).classList.remove("uploader_target");
    },
};

async function upload() {
    if (chosedFiles.files.length) {
        const fileBuffers: ArrayBuffer[] = [];
        const fileNames: string[] = [];

        for (let i = 0; i < chosedFiles.files.length; i++) {
            fileBuffers.push((await chosedFiles.read(i, { readAs: "readAsArrayBuffer" })) as ArrayBuffer);
            fileNames.push(chosedFiles.files[i].name);
        }

        PostMessage(
            { step: "splitBuffer", fileBuffers, fileNames, folderId: panStore.currentFolderId },
            fileBuffers
        );
    }
}
</script>

<style lang="scss" scoped>
.fileUploader {
    display: flex;
    flex-direction: column;
    padding: 0.4rem 0.5rem;
    overflow: hidden;

    .header {
        display: flex;
        gap: 2rem;
        width: 100%;
        height: 2.5rem;
        margin-bottom: 0.4rem;
    }

    .uploader {
        flex: 1;
        background-color: var(--color-bg-bland);
        width: auto;
        overflow-y: scroll;

        .tip {
            flex-direction: column;
            height: 100%;
        }

        .chosedFileList {
            box-sizing: border-box;
            padding: 0 2rem;

            > :last-child {
                border: none;
            }
        }
    }
}

.uploader_target {
    background-color: var(--color-bg-deep) !important;
}
</style>
