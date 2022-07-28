<template>
    <div class="search">
        <div class="icon">
            <SvgIcon name="layout-search" @click="search"></SvgIcon>
        </div>

        <input class="chuyuan" @keypress.enter="search" type="text" v-model="keyWord" placeholder="搜索" />
    </div>
</template>

<script setup lang="ts">
const emit = defineEmits(["onChangeSideBarState"]);

const router = useRouter();
const route = useRoute();
let keyWord = ref("");

onMounted(() => {
    if (route.query.keyWord) {
        keyWord.value =
            typeof route.query.keyWord == "string" ? route.query.keyWord : route.query.keyWord.join(" ");
    }
});

function search() {
    if (keyWord.value) {
        router.push({ path: "/search", query: { keyWord: keyWord.value } });
        emit("onChangeSideBarState");
    } else {
        router.push({ path: "/" });
    }
}
</script>

<style lang="scss" scoped>
.search {
    --height: 2.4rem;
    position: relative;
    display: flex;
    justify-content: center;
    .icon {
        position: absolute;
        box-sizing: border-box;
        padding: 0.3rem;
        left: 0;
        top: 0;
        height: var(--height);
        width: var(--height);
        .svgIcon {
            --h: calc(var(--height) - 0.3rem);
            height: var(--h);
            width: var(--h);
            fill: var(--color-text-theme);
            &:hover {
                fill: var(--color-text-theme);
            }
        }
    }
    input {
        height: var(--height);
        width: 100%;
        padding-left: calc(var(--height) + 0.3rem);
        color: #bebfc1;
        border-color: #626a74;
        background-color: #24292f; // 和header一致
    }
}
</style>
