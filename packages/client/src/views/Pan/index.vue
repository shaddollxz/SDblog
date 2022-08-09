<template>
    <div class="pan">
        <div class="left">
            <Breadcrumb></Breadcrumb>
            <FolderControl></FolderControl>
            <Folder></Folder>
        </div>
        <div class="right">
            <Uploader></Uploader>
        </div>
    </div>
</template>

<script setup lang="ts">
import { usePanStore } from "@/store/pan";
import Breadcrumb from "./Breadcrumb.vue";
import Folder from "./Folder.vue";
import FolderControl from "./FolderControl.vue";
import Uploader from "./UploaderProgress.vue";

onMounted(() => usePanStore().getFolder());
</script>

<style lang="scss" scoped>
.pan {
    margin-left: $width-wife;
    width: 60%;
}

.left {
    .folderControl {
        margin: $gap-large $gap-xlarge;
    }
    .breadcrumb {
        padding: $gap-big $gap-large;
        border-bottom: 1px solid var(--color-border);
    }
}
.right {
}
</style>
