<template>
    <div class="left">
        <Me></Me>
        <TagBox></TagBox>
    </div>
</template>

<script setup lang="ts">
import TagBox from "./TagBox.vue";
import Me from "./Me.vue";
</script>

<style lang="scss" scoped>
.left {
    margin-bottom: 1rem;
    > div {
        background-color: var(--color-bg-bland);
    }
}
@media screen and (max-width: 750px) {
    .tagBox {
        display: none;
    }
}
</style>
