<template>
    <div class="pan">
        <FileUploader></FileUploader>
    </div>
</template>

<script setup lang="ts">
import FileUploader from "./FileUploader/index.vue";
</script>

<style lang="scss" scoped>
.pan {
    margin-left: $width-wife;
}
.fileUploader {
    width: 60%;
    height: 30rem;
}
</style>
