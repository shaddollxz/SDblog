<template>
    <div v-show="haveData" class="uploaderProgress gusto-border">
        进度条
        <template v-for="(value, name) of uploadings">
            <div class="item">
                <div>文件：{{ name }}</div>
                <div>状态：上传中...</div>
                <Slider v-model="value.progress"></Slider>
            </div>
        </template>
        <template v-for="(_, name) of analyzeings">
            <div class="item">
                <div>文件：{{ name }}</div>
                <div>状态：解析文件中...</div>
            </div>
        </template>
        <template v-for="(_, name) of waitUploads">
            <div class="item">
                <div>文件：{{ name }}</div>
                <div>状态：等待上传...</div>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { uploadWorker } from "./FileUploader/worker";
import type { MainOnMessage } from "./FileUploader/worker";

const analyzeings: Record<string, boolean> = shallowReactive({});
const waitUploads: Record<string, { chunks: number; progress: number }> = shallowReactive({});
const uploadings: Record<string, { chunks: number; progress: number }> = shallowReactive({});
const haveData = computed(
    () =>
        !!Object.keys(analyzeings).length ||
        !!Object.keys(waitUploads).length ||
        !!Object.keys(uploadings).length
);

uploadWorker.addEventListener("message", ({ data }: { data: MainOnMessage }) => {
    switch (data.step) {
        case "beginAnalyzeFile":
            {
                const { name } = data;
                if (!analyzeings[name]) {
                    analyzeings[name] = true;
                }
            }
            break;
        case "analyzeFileEnd":
            {
                const { name, chunks } = data;
                delete analyzeings[name];
                waitUploads[name] = { chunks, progress: 0 };
            }
            break;
        case "progress":
            {
                const { name, already } = data;
                const item = waitUploads[name];
                if (item) {
                    uploadings[name] = item;
                    item.progress = (already / item.chunks) * 100;
                    delete waitUploads[name];
                } else {
                    const uploading = uploadings[name];
                    uploading.progress = (already / uploading.chunks) * 100;
                    console.log(uploading.progress);
                }
            }
            break;
        case "end":
            {
                const { name } = data;
                delete uploadings[name];
            }
            break;
    }
});
</script>

<style lang="scss" scoped>
.uploaderProgress {
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 2 * $height-header);
    .item {
        margin-top: $gap;
        border-bottom: 1px solid var(--color-border);
        width: 100%;
        padding: $gap 0 $gap $gap;
        .slider {
            margin: $gap 0 $gap $gap;
            width: 80%;
            :deep(.btn) {
                display: none;
            }
        }
    }
}
</style>
