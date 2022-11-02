<template>
    <slot v-if="show"></slot>
    <div v-else class="global-noData">
        <div class="gusto-flex-center-col" v-if="isInternet">
            <SvgIcon name="noData-noData"></SvgIcon>
            <p>没有找到相关数据</p>
        </div>
        <div class="gusto-flex-center-col" v-else>
            <SvgIcon name="noData-noInternet"></SvgIcon>
            <p>没有网络链接</p>
            <p>请链接网络后再刷新页面</p>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    show: boolean;
}
defineProps<Props>();

const isInternet = ref(false);
onMounted(() => {
    isInternet.value = window.navigator.onLine;
});
</script>

<style lang="scss">
.global-noData {
    box-sizing: border-box;
    padding: 3rem 0;
    background-color: var(--color-bg-bland);
    .svgIcon {
        width: calc(var(--fontsize-xxlarge) * 2);
    }
}
</style>
