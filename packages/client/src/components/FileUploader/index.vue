<template>
    <div class="fileUploader">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import { LocalFiles } from "sdt3";
import UploadWorker from "./sliceFileAndUpload.worker?worker";
import type { MainPostMessage, MainOnMessage } from "./types";

interface Props {
    isSendProgress: boolean;
    options: {
        path: string;
        folderId: string;
        name: string;
    };
}
const props = withDefaults(defineProps<Props>(), {
    isSendProgress: true,
});
interface Emits {
    (e: "onProcess", process: number): void;
    (e: "onFinish", filename: string, folderJson: string): void;
    (e: "onError", errorType: MainOnMessage["error"]): void;
}
const emit = defineEmits<Emits>();

async function choseFile() {
    const files = await new LocalFiles();
    if (files.files.length) {
        const uploadWorker = new UploadWorker();
        uploadWorker.postMessage({
            files,
            folderId: props.options.folderId,
            name: props.options.name,
            isSendProgress: props.isSendProgress,
        } as MainPostMessage);
        uploadWorker.onmessage = ({ data }: { data: MainOnMessage }) => {
            if (data.error) {
                emit("onError", data.error);
                return;
            }
            if (data.finish && data.finishOrder && data.folderJson) {
                emit("onFinish", files.names[data.finishOrder], data.folderJson);
            }
        };
    }
}
</script>

<style lang="scss" scoped></style>
