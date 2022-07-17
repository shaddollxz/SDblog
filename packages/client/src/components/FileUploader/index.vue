<template>
    <div class="fileUploader"></div>
</template>

<script setup lang="ts">
import { LocalFiles } from "sdt3";
import UploadWorker from "./sliceFileAndUpload.worker?worker";

interface Props {
    isSendProgress: boolean;
    path: string;
}
const props = withDefaults(defineProps<Props>(), {
    isSendProgress: true,
});
interface Emits {
    (e: "onProcess", process: number): void;
    (e: "onFinish"): void;
    (e: "onError"): void;
}
const emit = defineEmits<Emits>();

const uploadWorker = new UploadWorker();

async function choseFile() {
    const files = await new LocalFiles();
    if (files.files.length) {
        uploadWorker.postMessage({ files, isSendProgress: props.isSendProgress, path: props.path });
        uploadWorker.onmessage = ({ data }) => {
            if (data.error) {
                emit("onError");
            }
            if (data.finish) {
                emit("onFinish");
            }
        };
    }
}
</script>

<style lang="scss" scoped></style>
