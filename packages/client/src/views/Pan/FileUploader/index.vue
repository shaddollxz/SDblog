<template>
    <div class="fileUploader">
        <div class="header">
            <div class="gusto-button" @click="choseFiles">
                <SvgIcon name="pan-addFile"></SvgIcon>
                <span>选择文件</span>
            </div>
            <div class="gusto-button" @click="upload">
                <SvgIcon name="pan-upload"></SvgIcon>
                <span>上传</span>
            </div>
        </div>
        <div class="uploader gusto-border" v-dragtarget="dropOption">
            <div class="tip gusto-flex-center-col" v-show="!chosedFiles.files.length">
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
import { LocalFiles, Message } from "sdt3";
import type { VDragType } from "sdt3";
import { PostMessage, uploadWorker } from "./worker";
import type { MainOnMessage } from "./worker/types";
import { usePanStore } from "@/store/pan";
import ChosedFileItem from "./ChosedFileItem.vue";

interface Emits {
    (n: "onBeginUpload"): void;
    (n: "onChosedFile"): void;
}
const emit = defineEmits<Emits>();

const panStore = usePanStore();

const chosedFiles = reactive(new LocalFiles({ count: 10 }));
async function choseFiles() {
    await chosedFiles.getFile();
    if (chosedFiles.files.length > 1) filesRepeat(chosedFiles.files);
    emit("onChosedFile");
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
    emit("onBeginUpload");
    if (chosedFiles.files.length) {
        const fileBuffers: ArrayBuffer[] = [];
        const fileNames: string[] = [];

        for (let i = 0; i < chosedFiles.files.length; i++) {
            fileBuffers.push((await chosedFiles.read(i, { readAs: "readAsArrayBuffer" })) as ArrayBuffer);
            fileNames.push(chosedFiles.files[i].name);
        }

        PostMessage(
            { step: "splitBuffer", fileBuffers, fileNames, folderId: panStore.currentFolder.id },
            fileBuffers
        );
    }
}

uploadWorker.addEventListener("message", ({ data }: { data: MainOnMessage }) => {
    if (data.step == "end") {
        panStore.refreshPathFolder(data.folderJson);
        chosedFiles.files = [];
    }
    if (data.step == "error") {
        Message.error(data.msg);
    }
});

/** 按文件名进行去重 */
function filesRepeat(files: File[]) {
    const history: object = {};
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (history[file.name]) {
            files.splice(i, 1);
        } else {
            history[file.name] = true;
        }
    }
    return files;
}
</script>

<style lang="scss" scoped>
.fileUploader {
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .header {
        display: flex;
        gap: $gap-xxlarge;
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
