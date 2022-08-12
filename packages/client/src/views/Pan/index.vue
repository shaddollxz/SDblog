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
    display: flex;
    gap: $gap-large;
    margin-left: $width-wife;
    width: calc(100% - $width-wife);
}

.left {
    flex: 2;
    .folderControl {
        margin: $gap-large $gap-xlarge;
    }
    .breadcrumb {
        padding: $gap-big $gap-large;
        border-bottom: 1px solid var(--color-border);
    }
}
.right {
    flex: 1;
    margin-right: $gap-big;
}
</style>
