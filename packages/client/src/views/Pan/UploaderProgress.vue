<template>
    <div v-show="haveData" class="uploaderProgress gusto-border">
        <template v-for="(_, name) of waitAnalyzes">
            <div class="item">
                <div>文件：{{ name }}</div>
                <div>状态：等待解析文件...</div>
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
        <template v-for="(value, name) of uploadings">
            <div class="item">
                <div>文件：{{ name }}</div>
                <div>状态：上传中...</div>
                <Slider v-model="value.progress"></Slider>
            </div>
        </template>
        <template v-for="(_, name) of waitConcats">
            <div class="item">
                <div>文件：{{ name }}</div>
                <div>状态：服务器解析中...</div>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { uploadWorker } from "./FileUploader/worker";
import type { MainOnMessage } from "./FileUploader/worker";

// 等待切片
const waitAnalyzes: Record<string, boolean> = shallowReactive({});
// 正在切片
const analyzeings: Record<string, boolean> = shallowReactive({});
// 等待上传
const waitUploads: Record<string, { chunks: number; progress: number }> = shallowReactive({});
// 正在上传
const uploadings: Record<string, { chunks: number; progress: number }> = reactive({});
// 等待后端合并文件
const waitConcats: Record<string, boolean> = shallowReactive({});

const haveData = computed(
    () =>
        !!Object.keys(waitAnalyzes).length ||
        !!Object.keys(analyzeings).length ||
        !!Object.keys(waitUploads).length ||
        !!Object.keys(uploadings).length ||
        !!Object.keys(waitConcats).length
);

uploadWorker.addEventListener("message", ({ data }: { data: MainOnMessage }) => {
    switch (data.step) {
        case "beginAnalyzeFile": {
            const { name } = data;
            if (!analyzeings[name]) {
                analyzeings[name] = true;
            }
            break;
        }

        case "analyzeFileEnd": {
            const { name, chunks } = data;
            delete analyzeings[name];
            waitUploads[name] = { chunks, progress: 0 };
            break;
        }

        case "progress": {
            const { name, already, chunks } = data;
            const item = waitUploads[name];
            if (!item) {
                const uploading = uploadings[name];
                if (uploading) {
                    uploading.progress = (already / uploading.chunks) * 100;
                } else {
                    uploadings[name] = { chunks, progress: (already / chunks) * 100 };
                }
            } else {
                uploadings[name] = item;
                item.progress = (already / item.chunks) * 100;
                delete waitUploads[name];
            }
            break;
        }

        case "waitUploadEnd": {
            const { name } = data;
            delete uploadings[name];
            waitConcats[name] = true;
            break;
        }

        case "end": {
            const { name } = data;
            delete waitConcats[name];
            delete waitUploads[name];
            break;
        }
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
