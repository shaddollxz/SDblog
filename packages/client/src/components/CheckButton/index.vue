<template>
    <div class="checkButton gusto-button" :class="{ canClick: isCanClick && !timer }" @click="click">
        <span v-if="!timer">
            <slot></slot>
        </span>
        <span v-else>{{ timer }}</span>
    </div>
</template>

<script setup lang="ts">
import { debounce } from "sdt3";

const props = defineProps({
    isCanClick: {
        type: Boolean,
        default: false,
    },
    delay: {
        type: Number,
        default: 0,
    },
});
const emit = defineEmits(["onClick"]);

let timer = ref(0);
let click: () => void, interval: number;
if (props.delay) {
    click = debounce(() => {
        emit("onClick");
        timer.value = Math.ceil(props.delay / 1000);
        //todo 开始倒计时
        interval = window.setInterval(() => {
            timer.value = timer.value - 1;
            if (!timer.value) {
                clearInterval(interval);
            }
        }, 1000);
    }, props.delay);
} else {
    click = () => emit("onClick");
}

onMounted(() => clearInterval(interval));
</script>

<style lang="scss" scoped>
.checkButton {
    color: var(--color-text-default);
    background-color: var(--color-bg-deep);
    pointer-events: none;
    &:hover {
        color: var(--color-text-default);
        background-color: var(--color-bg-deep);
    }
    &.canClick {
        pointer-events: all !important;
        color: var(--color-green-8);
        background-color: var(--color-green);
        &:hover {
            background-color: var(--color-green-1);
            border-color: transparent;
        }
    }
}
</style>
