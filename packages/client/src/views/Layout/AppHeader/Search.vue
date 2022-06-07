<template>
    <div class="search">
        <i class="iconfont icon-sousuo" @click="search"></i>

        <input class="chuyuan" @keypress.enter="search" type="text" v-model="keyWord" placeholder="搜索" />
    </div>
</template>

<script setup lang="ts">
const emit = defineEmits(["onChangeSideBarState"]);

const router = useRouter();
let keyWord = ref("");

function search() {
    if (keyWord.value) {
        router.push({ path: "/search", query: { keyWord: keyWord.value } });
        emit("onChangeSideBarState");
    }
}
</script>

<style lang="scss" scoped>
.search {
    position: relative;
    display: flex;
    justify-content: center;
    i {
        position: absolute;
        margin-left: 0.3rem;
        left: 0;
        font-size: var(--fontsize-large) !important;
        color: var(--color-text-theme);
        &:hover {
            color: var(--color-text-theme);
        }
    }
    input {
        height: 2.4rem;
        width: 100%;
        padding-left: 2.7rem;
        color: #bebfc1;
        border-color: #626a74;
        background-color: #24292f; // 和header一致
    }
}
</style>
