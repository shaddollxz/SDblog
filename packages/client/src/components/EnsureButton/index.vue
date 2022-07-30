<template>
    <Popover v-bind="$attrs" v-model="isShow">
        <slot></slot>
        <template #popup>
            <div :style="{ maxWidth }">
                <span>{{ text }}</span>
                <input v-if="type == 'input'" type="text" v-model="inputValue" />
                <div class="ensure">
                    <div class="gusto-button" @click="$emit('onSure', inputValue)">确定</div>
                    <div class="gusto-button" @click="onCancel">取消</div>
                </div>
            </div>
        </template>
    </Popover>
</template>

<script setup lang="ts">
import Popover from "../Popover/index.vue";

interface Props {
    text: string;
    type?: "input" | "string";
    maxWidth?: string;
}
withDefaults(defineProps<Props>(), { type: "string", maxWidth: "18rem" });
interface Emits {
    (n: "onCancel"): void;
    (n: "onSure", value: string): void;
}
const emit = defineEmits<Emits>();

const isShow = ref(false);
function onCancel() {
    isShow.value = false;
    emit("onCancel");
}

const inputValue = ref("");
</script>

<style lang="scss" scoped>
.ensure {
    display: flex;
    gap: $gap;
    width: max-content;
    margin: 0.8rem 0 0 auto;
}
</style>
