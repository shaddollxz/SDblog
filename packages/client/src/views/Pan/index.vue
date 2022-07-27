<template>
    <div class="pan">
        <Popover>
            <div class="gusto-button">上传文件</div>
            <template #popup>
                <FileUploader></FileUploader>
            </template>
        </Popover>
    </div>
</template>

<script setup lang="ts">
import FileUploader from "./FileUploader/index.vue";
import Folder from "./Folder.vue";
import Popover from "@/components/Popover/index.vue";
import { usePanStore } from "@/store/pan";

const panStore = usePanStore();
onMounted(() => panStore.getFolder());
</script>

<style lang="scss" scoped>
.pan {
    margin-left: $width-wife;
}
.fileUploader {
    width: 30vw;
    height: 30rem;
}
</style>
