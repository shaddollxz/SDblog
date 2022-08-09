<template>
    <div class="uploaderProgress">
        <template v-for="item of analyzeings">
            <div class="item analyzeing"></div>
        </template>
        <template v-for="item of uploadings">
            <div class="item uploading"></div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { uploadWorker } from "./FileUploader/worker";
import type { MainOnMessage } from "./FileUploader/worker";

const analyzeings: { name: string }[] = [];
const uploadings: { name: string; chunks: number; uploaded: number }[] = [];

uploadWorker.addEventListener("message", ({ data }: { data: MainOnMessage }) => {
    switch (data.step) {
        case "beginAnalyzeFile":
            {
                const { name } = data;
                analyzeings.push({ name });
            }
            break;
        case "analyzeFileEnd":
            {
                const { name, chunks } = data;
                const index = analyzeings.findIndex((item) => item.name == name);
                if (!~index) {
                    analyzeings.splice(index, 1);
                    uploadings.push({ name, chunks, uploaded: 0 });
                }
            }
            break;
        case "progress":
            {
                const { name, already } = data;
                const upload = uploadings.find((item) => item.name == name);
                if (upload) {
                    upload.uploaded = already;
                }
            }
            break;
        case "end":
            {
                const { name } = data;
                uploadings.splice(
                    uploadings.findIndex((item) => item.name == name),
                    1
                );
            }
            break;
    }
});
</script>

<style lang="scss" scoped></style>
