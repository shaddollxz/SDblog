<template>
    <div class="pan">
        <Breadcrumb></Breadcrumb>
        <FolderControl></FolderControl>
        <Folder></Folder>
    </div>
</template>

<script setup lang="ts">
import { usePanStore } from "@/store/pan";
import Breadcrumb from "./Breadcrumb.vue";
import Folder from "./Folder.vue";
import FolderControl from "./FolderControl.vue";

const panStore = usePanStore();

onMounted(() => panStore.getFolder());
</script>

<style lang="scss" scoped>
.pan {
    margin-left: $width-wife;
    width: 60%;
}

.folderControl {
    margin: $gap-large $gap-xlarge;
}

.breadcrumb {
    padding: $gap-big $gap-large;
    border-bottom: 1px solid var(--color-border);
}
</style>
