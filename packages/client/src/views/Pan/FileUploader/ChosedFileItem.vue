<template>
    <li class="chosedFileItem gusto-flex-center">
        <div class="left">
            <span>{{ file.name }}</span>
            <span class="size">{{ $formatBit(file.size) }}</span>
        </div>
        <div class="canClick" @click="emit('onRemove', file)">✖</div>
    </li>
</template>

<script setup lang="ts">
interface Props {
    file: File;
}
interface Emits {
    (n: "onRemove", file: File): void;
}
defineProps<Props>();
const emit = defineEmits<Emits>();
</script>

<style lang="scss" scoped>
.chosedFileItem {
    list-style: none;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 1rem 1rem;
    border-bottom: 2px solid var(--color-border);
    .left {
        display: flex;
        flex-direction: column;
        gap: $gap;
        .size {
            font-size: var(--fontsize-small);
        }
    }
}
</style>
