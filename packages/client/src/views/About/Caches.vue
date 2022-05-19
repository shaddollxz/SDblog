<template>
    <div class="caches">
        <span>当前已用缓存：{{ cache }}MB（占总可用缓存的{{ percent }}%）</span>
        <CheckButton :isCanClick="!!cacheDetail" @onClick="clearCache">清除缓存</CheckButton>
        <i
            class="iconfont icon-bangzhu canClick"
            title="只会清除程序加载的资源，还有剩余缓存请从浏览器设置中清除"
        ></i>
    </div>
</template>

<script setup lang="ts">
import CheckButton from "@/components/CheckButton/index.vue";
import { SDMath, Message } from "sdt3";

let cacheDetail = ref(0);
let percentDetail = ref(0);
const cache = computed(() => SDMath.round(cacheDetail.value / (1024 * 1000), 2));
const percent = computed(() => SDMath.round(percentDetail.value * 100, 2));

function getCacheSize() {
    return navigator?.storage?.estimate().then((data) => {
        cacheDetail.value = data.usage ?? 0;
        percentDetail.value = (data.usage ?? 0) / (data.quota ?? Infinity);
    });
}
async function clearCache() {
    const keyList = await caches.keys();
    await Promise.all(
        keyList.map((key) => {
            return caches.delete(key);
        })
    );
    await getCacheSize();
    Message.success("已清除所有缓存");
}

onMounted(getCacheSize);
</script>

<style lang="scss" scoped>
.caches {
    display: flex;
    align-items: center;
}
i {
    margin-left: 1rem;
    font-size: var(--fontsize-big);
}
</style>
