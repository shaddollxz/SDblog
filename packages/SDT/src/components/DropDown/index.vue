<template>
    <div class="dropDown"></div>
</template>

<script setup lang="ts">
interface Props {}
interface Emits {}
const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits<Emits>();

defineExpose({});
</script>

<style lang="scss" scoped></style>
