<template>
    <Popover v-bind="$attrs" v-model="isShow">
        <slot></slot>
        <template #popup>
            <span>{{ text }}</span>
            <div class="ensure">
                <div class="gusto-button" @click="$emit('onSure')">确定</div>
                <div class="gusto-button" @click="onCancel">取消</div>
            </div>
        </template>
    </Popover>
</template>

<script setup lang="ts">
import Popover from "../Popover/index.vue";

interface Props {
    text: string;
}
defineProps<Props>();
interface Emits {
    (n: "onCancel"): void;
    (n: "onSure"): void;
}
const emit = defineEmits<Emits>();

const isShow = ref(false);
function onCancel() {
    isShow.value = false;
    emit("onCancel");
}
</script>

<style lang="scss" scoped>
.ensure {
    display: flex;
    gap: $gap;
    width: max-content;
    margin: 0.8rem 0 0 auto;
}
</style>
