<template>
    <svg class="svgIcon" aria-hidden="true">
        <use :xlink:href="symbolId" />
    </svg>
</template>

<script setup lang="ts">
interface Props {
    name: string;
}
const props = defineProps<Props>();

const symbolId = computed(() => (props.name.startsWith("icon-") ? "#" + props.name : "#icon-" + props.name));
</script>

<style>
.svgIcon {
    fill: var(--color-text-default);
}
</style>
