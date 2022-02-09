<template>
    <div class="selectInput gusto-border" @click="focusInput">
        <div class="input">
            <div class="left">
                <div class="selected gusto-border" v-for="item of selectedItems" :key="item._id">
                    <span>{{ item.value }}</span>
                    <strong @click="removeItem(item)">✖</strong>
                    <!-- <i @click="removeItem(item)"></i> -->
                </div>
                <input
                    ref="input"
                    v-model.trim="inputValue"
                    @keyup="filterItem"
                    @keydown.tab.prevent="createNewOption"
                    @keydown.delete="deleteLastItem"
                    type="text"
                    v-bind="$attrs"
                />
            </div>
            <div class="arrow" :class="{ isShowOptions }" @click="isShowOptions = !isShowOptions">❮</div>
        </div>
        <div class="select gusto-border" v-show="isShowOptions">
            <div class="option" v-for="item of list" :key="item._id" @click="select(item)">
                {{ item.value }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { TagInfo } from "@blog/server";

interface Props {
    optionList: TagInfo[];
    limit?: number;
}
const props = withDefaults(defineProps<Props>(), { limit: 4 });
const emit = defineEmits(["addNewTag"]);

let isShowOptions = ref(false);
const input = shallowRef<HTMLInputElement | null>(null);
const inputValue = ref("");
const selectedItems = shallowReactive<TagInfo[]>([]);
let list = shallowRef(props.optionList);

function focusInput() {
    input.value!.focus();
}
function select(option: TagInfo) {
    if (selectedItems.length < props.limit) {
        selectedItems.push(option);
        isShowOptions.value = false;
        inputValue.value = "";
    }
}
function createNewOption() {
    if (inputValue.value !== "" && selectedItems.length < props.limit) {
        emit("addNewTag", inputValue.value, (item: TagInfo) => {
            selectedItems.push(item);
            inputValue.value = "";
            input.value!.focus();
        });
    }
}
function removeItem(item: TagInfo) {
    selectedItems.splice(selectedItems.indexOf(item), 1);
}
function deleteLastItem() {
    if (inputValue.value === "") {
        selectedItems.pop();
    }
}

function filterItem() {
    nextTick(() => {
        if (inputValue.value === "") {
            isShowOptions.value = false;
            list.value = props.optionList;
        } else {
            isShowOptions.value = true;
            const regexp = new RegExp(inputValue.value, "g");
            list.value = props.optionList.filter((item) => regexp.test(item.value));
        }
    });
}

defineExpose({ selectedItems });
</script>

<style lang="scss" scoped>
$height: 3rem;
.selectInput {
    height: $height;
    position: relative;
    box-sizing: border-box;
    padding: 0.5rem 1rem;
    .input {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: space-between;
        .left {
            width: 100%;
            display: flex;
            align-items: center;
            .selected {
                flex: 0 0 auto;
                position: relative;
                min-width: 3rem;
                padding: 0.2rem 1.8rem 0.2rem 0.4rem;
                margin-right: 0.5rem;
                background-color: var(--color-bg-bland);
                strong {
                    position: absolute;
                    right: 0.5rem;
                    cursor: pointer;
                    &:hover {
                        color: var(--color-text-theme);
                    }
                }
            }
            input {
                display: block;
                min-width: 3rem;
                width: 15rem;
                border: none;
                background-color: transparent;
                cursor: default;
            }
        }

        .arrow {
            flex: 0 0 auto;
            font-size: 1.5rem;
            font-weight: 600;
            transform: rotate(-90deg);
            transition: all linear 0.3s;
            color: var(--color-text-theme);
            cursor: pointer;
            &.isShowOptions {
                transform: rotate(90deg);
            }
        }
    }
}
.select {
    position: absolute;
    top: calc(0.5rem + $height);
    left: 0;
    width: 100%;
    max-height: 10rem;
    overflow-y: scroll;
    .option {
        font-weight: 600;
        box-sizing: border-box;
        padding: 0.5rem 1rem;
        border-bottom: 1px solid var(--color-border);
        background-color: var(--color-bg-bland);
        &:hover {
            background-color: var(--color-bg-deep);
        }
    }
}
</style>
