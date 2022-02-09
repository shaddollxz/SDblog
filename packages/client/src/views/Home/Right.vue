<template>
    <div class="right">
        <Clock></Clock>
        <TimeLine></TimeLine>
    </div>
</template>

<script setup lang="ts">
import Clock from "./Clock.vue";
import TimeLine from "./TimeLine.vue";
</script>

<style lang="scss" scoped>
$paddingLeft: 2.5rem;
.right {
    > div {
        border-radius: 0.5rem;
        border: 1px solid var(--color-border);
        background-color: var(--color-bg-bland);
    }
}
.clock {
    height: 12rem;
    box-sizing: border-box;
    padding: 1rem 0.5rem 1rem calc($paddingLeft / 2);
}
</style>
