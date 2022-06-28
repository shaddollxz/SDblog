<template>
    <div class="noData">
        <div v-if="isInternet">
            <SvgIcon name="noData-noData"></SvgIcon>
            <p>没有找到相关数据</p>
        </div>
        <div v-else>
            <SvgIcon name="noData-noInternet"></SvgIcon>
            <p>没有网络链接</p>
            <p>请链接网络后再刷新页面</p>
        </div>
    </div>
</template>

<script lang="ts">
export default defineComponent({
    name: "noData",
    data() {
        return {
            isInternet: false,
        };
    },
    mounted() {
        this.isInternet = window.navigator.onLine;
    },
});
</script>

<style lang="scss" scoped>
.noData {
    box-sizing: border-box;
    padding: 3rem 0;
    div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .svgIcon {
            width: calc(var(--fontsize-xxlarge) * 2);
            height: calc(var(--fontsize-xxlarge) * 2);
        }
    }
}
</style>
