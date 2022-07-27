<template>
    <div class="popover" @click.capture="changeState" ref="popover">
        <slot></slot>
        <div class="popup gusto-border" v-show="modelValue" :style="popupStyle">
            <div class="arrow" v-show="arrow" :style="arrowStyle"></div>
            <slot name="popup"></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from "vue";
interface Props {
    directive?: "ts" | "te" | "t" | "l" | "ls" | "le" | "r" | "rs" | "re" | "b" | "bs" | "be";
    deviation?: { x: string; y: string };
    arrow?: boolean;
    modelValue?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
    directive: "b",
    deviation: () => ({ x: "0px", y: "0px" }),
    arrow: true,
    modelValue: false,
});
interface Emits {
    (n: "onClose"): void;
    (n: "update:modelValue", isShow: boolean): void;
}
const emit = defineEmits<Emits>();

function changeState(e: MouseEvent) {
    if (!(e.target as HTMLDivElement).classList.contains("popup")) {
        emit("update:modelValue", !props.modelValue);
    }
}

const popover = shallowRef<HTMLDivElement | null>(null);

function hidden(e: MouseEvent) {
    const target = e.target as HTMLDivElement;
    if (!target.classList.contains("popup")) {
        if (!target.classList.contains("popover")) {
            emit("update:modelValue", false);
            emit("onClose");
        }
    }
}
onMounted(() => window.addEventListener("click", hidden, true));
onUnmounted(() => window.removeEventListener("click", hidden));

const popupStyle = ref<CSSProperties>({});
const arrowStyle = ref<CSSProperties>({});
onMounted(() => {
    const dom = popover.value?.children[0]! as HTMLElement;
    if (dom.classList.contains("popup")) return;

    const deviation = props.deviation;
    switch (props.directive) {
        case "b":
            popupStyle.value = {
                left: `calc(50% + ${deviation.x})`,
                top: `calc(100% + ${deviation.y})`,
                transform: `translate(-50%,${deviation.y == "0px" ? "1.2rem" : "0px"})`,
            };
            arrowStyle.value = {
                left: `calc(50% - ${deviation.y})`,
                top: "0",
                transform: "translate(-50%,-50%) rotate(45deg)",
            };
            break;
        case "bs":
            popupStyle.value = {
                left: `calc(0px + ${deviation.x})`,
                top: `calc(100% + ${deviation.y})`,
                transform: `translate(0,${deviation.y == "0px" ? "1.2rem" : "0px"})`,
            };
            arrowStyle.value = {
                left: `calc(${dom.clientWidth / 2}px - ${deviation.x})`,
                top: "0",
                transform: "translate(-50%,-50%) rotate(45deg)",
            };
            break;
        case "be":
            popupStyle.value = {
                right: `calc(0px - ${deviation.x})`,
                top: `calc(100% + ${deviation.y})`,
                transform: `translate(0,${deviation.y == "0px" ? "1.2rem" : "0px"})`,
            };
            arrowStyle.value = {
                right: `calc(${dom.clientWidth / 2}px + ${deviation.x})`,
                top: "0",
                transform: "translate(50%,-50%) rotate(45deg)",
            };
            break;

        case "t":
            popupStyle.value = {
                left: `calc(50% + ${deviation.x})`,
                bottom: `calc(100% + ${deviation.y})`,
                transform: `translate(-50%,${deviation.y == "0px" ? "1.2rem" : "0px"})`,
            };
            arrowStyle.value = {
                left: `calc(50% - ${deviation.x})`,
                bottom: "0",
                transform: "translate(-50%,50%) rotate(225deg)",
            };
            break;
        case "ts":
            popupStyle.value = {
                left: `calc(0px + ${deviation.x})`,
                bottom: `calc(100% + ${deviation.y})`,
                transform: `translate(0px,${deviation.y == "0px" ? "1.2rem" : "0px"})`,
            };
            arrowStyle.value = {
                left: `calc(${dom.clientWidth / 2}px - ${deviation.x})`,
                bottom: "0",
                transform: "translate(-50%,50%) rotate(225deg)",
            };
            break;
        case "te":
            popupStyle.value = {
                right: `calc(0px - ${deviation.x})`,
                bottom: `calc(100% + ${deviation.y})`,
                transform: `translate(0px,${deviation.y == "0px" ? "1.2rem" : "0px"})`,
            };
            arrowStyle.value = {
                right: `calc(${dom.clientWidth / 2}px + ${deviation.x})`,
                bottom: "0",
                transform: "translate(50%,50%) rotate(225deg)",
            };
            break;

        case "l":
            popupStyle.value = {
                right: `calc(100% - ${deviation.x})`,
                top: `calc(50% + ${deviation.y})`,
                transform: `translate(${deviation.x == "0px" ? "-1.2rem" : "0px"},-50%)`,
            };
            arrowStyle.value = {
                right: "0",
                top: `calc(50% + ${deviation.x})`,
                transform: "translate(50%,-50%) rotate(135deg)",
            };
            break;
        case "ls":
            popupStyle.value = {
                right: `calc(100% - ${deviation.x})`,
                top: `calc(0px + ${deviation.y})`,
                transform: `translate(${deviation.x == "0px" ? "-1.2rem" : "0px"})`,
            };
            arrowStyle.value = {
                right: "0",
                top: `calc(${dom.clientHeight / 2}px - ${deviation.y})`,
                transform: "translate(50%,-50%) rotate(135deg)",
            };
            break;
        case "le":
            popupStyle.value = {
                right: `calc(100% - ${deviation.x})`,
                bottom: `calc(0px + ${deviation.y})`,
                transform: `translate(${deviation.x == "0px" ? "-1.2rem" : "0px"})`,
            };
            arrowStyle.value = {
                right: "0",
                bottom: `calc(${dom.clientHeight / 2}px - ${deviation.y})`,
                transform: "translate(50%,50%) rotate(135deg)",
            };
            break;

        case "r":
            popupStyle.value = {
                left: `calc(100% + ${deviation.x})`,
                top: `calc(50% + ${deviation.y})`,
                transform: `translate(${deviation.x == "0px" ? "1.2rem" : "0px"},-50%)`,
            };
            arrowStyle.value = {
                left: "0",
                top: `calc(50% - ${deviation.x})`,
                transform: "translate(-50%,-50%) rotate(315deg)",
            };
            break;
        case "rs":
            popupStyle.value = {
                left: `calc(100% + ${deviation.x})`,
                top: `calc(0px + ${deviation.y})`,
                transform: `translate(${deviation.x == "0px" ? "1.2rem" : "0px"})`,
            };
            arrowStyle.value = {
                left: "0",
                top: `calc(${dom.clientHeight / 2}px - ${deviation.y})`,
                transform: "translate(-50%,-50%) rotate(315deg)",
            };
            break;
        case "re":
            popupStyle.value = {
                left: `calc(100% + ${deviation.x})`,
                bottom: `calc(0px + ${deviation.y})`,
                transform: `translate(${deviation.x == "0px" ? "1.2rem" : "0px"})`,
            };
            arrowStyle.value = {
                left: "0",
                bottom: `calc(${dom.clientHeight / 2}px - ${deviation.y})`,
                transform: "translate(-50%,50%) rotate(315deg)",
            };
            break;
    }
});
</script>

<style lang="scss" scoped>
.popover {
    position: relative;
    margin-bottom: 0.4rem;
    width: max-content;
    height: max-content;
    .popup {
        position: absolute;
        width: max-content;
        height: max-content;
        box-sizing: border-box;
        padding: 1rem 1.5rem;
        background-color: var(--color-bg-deep);
        .arrow {
            position: absolute;
            width: 10%;
            max-width: 0.8rem;
            aspect-ratio: 1 / 1;
            background-color: var(--color-bg-deep);
            border: 1px solid var(--color-border);
            border-bottom: none;
            border-right: none;
            z-index: 255;
        }
    }
}
</style>
