<template>
    <div class="choseImg">
        <div class="chose gusto-border gusto-flex-center" @click="choseFile">
            <div v-if="!imgData" class="box gusto-flex-center">
                <i class="iconfont icon-tupian"></i>
                <slot></slot>
            </div>
            <img v-else class="gusto-fillImg" :src="imgData" alt="" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { LocalFiles } from "sdt3";

const props = defineProps({
    maxSize: Number,
});

const data = ref<File>(); // FileData
const imgData = ref(""); // base64 也可以是 url
async function choseFile() {
    const img = await new LocalFiles({
        type: ["jpg", "png", "jpeg", "gif"],
        maxSize: props.maxSize,
    });
    imgData.value = (await img.read({ readAs: "readAsDataURL" })) as string;
    data.value = img.files[0];
}

defineExpose({ data, imgData });
</script>

<style lang="scss" scoped>
.choseImg {
    width: 20rem;
    height: 10rem;
    .chose {
        width: 100%;
        height: 100%;
        overflow: hidden;
        cursor: pointer;
        .box {
            flex-direction: column;
            height: 100%;
            width: 100%;
            box-sizing: border-box;
            padding: 1rem 2rem;

            i {
                font-size: var(--fontsize-xxlarge);
            }
        }
    }
}
</style>
