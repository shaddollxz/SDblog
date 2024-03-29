<template>
    <Transition name="message" @before-leave="onClose" @after-leave="$emit('destroy')">
        <div class="message" v-show="isShow" :class="type" :style="style">
            <div :class="['text', align]">{{ text }}</div>
            <div @click="isShow = !isShow" :class="isCanClose || !(duration > 0) ? 'canClose' : 'cantClose'">
                ✖
            </div>
        </div>
    </Transition>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import type { StyleValue } from "vue";
export default defineComponent({
    name: "message",
});
</script>
<script setup lang="ts">
interface Props {
    text: string;
    type: "default" | "success" | "error" | "warning";
    duration: number; // 显示的事件 如果为零会无视isCanClose显示删除按钮
    isCanClose: boolean; // 是否显示删除按钮
    align: "left" | "right" | "center";
    style?: StyleValue;
    leaveTo: "top" | "left" | "bottom" | "right";
    onClose?: (el: Element) => void;
}
const props = defineProps<Props>();

// 定义时间之后消失
const isShow = ref(true);
// 如果持续设为零 则不会定时删除
onMounted(() => {
    if (props.duration > 0) {
        setTimeout(() => {
            isShow.value = false;
        }, props.duration);
    }
});

type Direction = {
    [key in Props["leaveTo"]]: string;
};
const directionMap: Direction = {
    top: "translateY(-100%)",
    bottom: "translateY(100%)",
    left: "translateX(-100%)",
    right: "translateX(100%)",
};

const direction = ref(directionMap[props.leaveTo]);
</script>

<style lang="scss" scoped>
.message {
    display: flex;
    align-items: center;
    width: 33%;
    height: max-content;
    box-sizing: border-box;
    padding: 1rem 1.8rem;
    margin: auto;
    margin-bottom: 0.6rem;
    border-radius: 0.4rem;
    &.default {
        color: var(--color-bg-bland);
        background-color: var(--color-text-default);
    }
    &.success {
        color: var(--color-green);
        background-color: var(--color-green-7);
    }
    &.error {
        color: var(--color-red);
        background-color: var(--color-red-7);
    }
    &.warning {
        color: var(--color-orange);
        background-color: var(--color-orange-7);
    }
    .text {
        margin-right: 1rem;
        font-size: 1rem;
        font-weight: 600;
        flex: 1;
        &.center {
            text-align: center;
        }
        &.left {
            text-align: left;
        }
    }
    .canClose {
        cursor: pointer;
    }
    .cantClose {
        display: none;
    }
}
.message-leave-active {
    transition: all 0.7s ease;
}
.message-leave-to {
    opacity: 0;
    transform: v-bind(direction);
}
</style>
