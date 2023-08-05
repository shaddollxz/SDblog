<template>
    <div class="popover" @click.capture="changeState" ref="popover">
        <slot></slot>
        <div class="popup gusto-border" v-show="modelValue ?? isShow" :style="popupStyle">
            <div class="arrow" v-show="arrow" :style="arrowStyle"></div>
            <slot name="popup"></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from "vue";
interface Props {
    directive?: "ts" | "te" | "t" | "l" | "ls" | "le" | "r" | "rs" | "re" | "b" | "bs" | "be";
    x?: string;
    y?: string;
    arrow?: boolean;
    modelValue?: boolean | null;
}
const props = withDefaults(defineProps<Props>(), {
    directive: "b",
    x: "0px",
    y: "0px",
    arrow: true,
    modelValue: null,
});
interface Emits {
    (n: "onClose"): void;
    (n: "update:modelValue", isShow: boolean): void;
}
const emit = defineEmits<Emits>();

const popover = shallowRef<HTMLDivElement | null>(null);
const isShow = ref(props.modelValue === null ? false : null);

function setIsShow(state?: boolean) {
    if (isShow.value === null) {
        emit("update:modelValue", state ?? !props.modelValue);
    } else {
        isShow.value = state ?? !isShow.value;
    }
}
function changeState(e: MouseEvent) {
    if (!(e.target as HTMLDivElement).classList.contains("popup")) {
        setIsShow();
    }
}
function hidden(e: MouseEvent) {
    const target = e.target as HTMLDivElement;
    if (!target.classList.contains("popup")) {
        if (!target.classList.contains("popover")) {
            setIsShow(false);
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

    const { x, y } = props;
    switch (props.directive) {
        case "b":
            popupStyle.value = {
                left: `calc(50% + ${x})`,
                top: `calc(100% + ${y})`,
                transform: `translate(-50%,${y == "0px" ? "1.2rem" : "0px"})`,
            };
            arrowStyle.value = {
                left: `calc(50% - ${y})`,
                top: "0",
                transform: "translate(-50%,-50%) rotate(45deg)",
            };
            break;
        case "bs":
            popupStyle.value = {
                left: `calc(0px + ${x})`,
                top: `calc(100% + ${y})`,
                transform: `translate(0,${y == "0px" ? "1.2rem" : "0px"})`,
            };
            arrowStyle.value = {
                left: `calc(${dom.clientWidth / 2}px - ${x})`,
                top: "0",
                transform: "translate(-50%,-50%) rotate(45deg)",
            };
            break;
        case "be":
            popupStyle.value = {
                right: `calc(0px - ${x})`,
                top: `calc(100% + ${y})`,
                transform: `translate(0,${y == "0px" ? "1.2rem" : "0px"})`,
            };
            arrowStyle.value = {
                right: `calc(${dom.clientWidth / 2}px + ${x})`,
                top: "0",
                transform: "translate(50%,-50%) rotate(45deg)",
            };
            break;

        case "t":
            popupStyle.value = {
                left: `calc(50% + ${x})`,
                bottom: `calc(100% + ${y})`,
                transform: `translate(-50%,${y == "0px" ? "1.2rem" : "0px"})`,
            };
            arrowStyle.value = {
                left: `calc(50% - ${x})`,
                bottom: "0",
                transform: "translate(-50%,50%) rotate(225deg)",
            };
            break;
        case "ts":
            popupStyle.value = {
                left: `calc(0px + ${x})`,
                bottom: `calc(100% + ${y})`,
                transform: `translate(0px,${y == "0px" ? "1.2rem" : "0px"})`,
            };
            arrowStyle.value = {
                left: `calc(${dom.clientWidth / 2}px - ${x})`,
                bottom: "0",
                transform: "translate(-50%,50%) rotate(225deg)",
            };
            break;
        case "te":
            popupStyle.value = {
                right: `calc(0px - ${x})`,
                bottom: `calc(100% + ${y})`,
                transform: `translate(0px,${y == "0px" ? "1.2rem" : "0px"})`,
            };
            arrowStyle.value = {
                right: `calc(${dom.clientWidth / 2}px + ${x})`,
                bottom: "0",
                transform: "translate(50%,50%) rotate(225deg)",
            };
            break;

        case "l":
            popupStyle.value = {
                right: `calc(100% - ${x})`,
                top: `calc(50% + ${y})`,
                transform: `translate(${x == "0px" ? "-1.2rem" : "0px"},-50%)`,
            };
            arrowStyle.value = {
                right: "0",
                top: `calc(50% + ${x})`,
                transform: "translate(50%,-50%) rotate(135deg)",
            };
            break;
        case "ls":
            popupStyle.value = {
                right: `calc(100% - ${x})`,
                top: `calc(0px + ${y})`,
                transform: `translate(${x == "0px" ? "-1.2rem" : "0px"})`,
            };
            arrowStyle.value = {
                right: "0",
                top: `calc(${dom.clientHeight / 2}px - ${y})`,
                transform: "translate(50%,-50%) rotate(135deg)",
            };
            break;
        case "le":
            popupStyle.value = {
                right: `calc(100% - ${x})`,
                bottom: `calc(0px + ${y})`,
                transform: `translate(${x == "0px" ? "-1.2rem" : "0px"})`,
            };
            arrowStyle.value = {
                right: "0",
                bottom: `calc(${dom.clientHeight / 2}px - ${y})`,
                transform: "translate(50%,50%) rotate(135deg)",
            };
            break;

        case "r":
            popupStyle.value = {
                left: `calc(100% + ${x})`,
                top: `calc(50% + ${y})`,
                transform: `translate(${x == "0px" ? "1.2rem" : "0px"},-50%)`,
            };
            arrowStyle.value = {
                left: "0",
                top: `calc(50% - ${x})`,
                transform: "translate(-50%,-50%) rotate(315deg)",
            };
            break;
        case "rs":
            popupStyle.value = {
                left: `calc(100% + ${x})`,
                top: `calc(0px + ${y})`,
                transform: `translate(${x == "0px" ? "1.2rem" : "0px"})`,
            };
            arrowStyle.value = {
                left: "0",
                top: `calc(${dom.clientHeight / 2}px - ${y})`,
                transform: "translate(-50%,-50%) rotate(315deg)",
            };
            break;
        case "re":
            popupStyle.value = {
                left: `calc(100% + ${x})`,
                bottom: `calc(0px + ${y})`,
                transform: `translate(${x == "0px" ? "1.2rem" : "0px"})`,
            };
            arrowStyle.value = {
                left: "0",
                bottom: `calc(${dom.clientHeight / 2}px - ${y})`,
                transform: "translate(-50%,50%) rotate(315deg)",
            };
            break;
    }
});
</script>

<style lang="scss" scoped>
.popover {
    position: relative;
    width: max-content;
    height: max-content;
    .popup {
        position: absolute;
        width: max-content;
        height: max-content;
        box-sizing: border-box;
        padding: 1rem 1.5rem;
        background-color: var(--color-bg-deep);
        z-index: 254;
        .arrow {
            position: absolute;
            width: 10%;
            max-width: 0.8rem;
            aspect-ratio: 1 / 1;
            background-color: inherit;
            border: 1px solid var(--color-border);
            border-bottom: none;
            border-right: none;
            z-index: 255;
        }
    }
}
</style>
