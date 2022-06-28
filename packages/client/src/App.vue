<template>
    <ProgressBar></ProgressBar>
    <AppHeader></AppHeader>
    <main>
        <RouterView></RouterView>
    </main>
    <AppFooter></AppFooter>

    <GoTop></GoTop>
    <Live2D v-if="!isMobile"></Live2D>
</template>

<script setup lang="ts">
import ProgressBar from "./views/Layout/ProgressBar.vue";
import AppHeader from "./views/Layout/AppHeader/index.vue";
import AppFooter from "./views/Layout/AppFooter.vue";
import GoTop from "./views/Layout/GoTop.vue";
import isMobile from "./utils/isMobile";
import { useTagStore } from "@/store/tags";
import { useUserStore } from "@/store/user";
import token from "@/storages/token";
const Live2D = defineAsyncComponent(() => import("./views/Layout/Live2D.vue"));
const userStore = useUserStore();
const tagStore = useTagStore();

onMounted(() => {
    if (token.get()) {
        userStore.relogin();
    }
    tagStore.getAllTag();
});
</script>

<style lang="scss">
header {
    height: $height-header;
}
main {
    margin: $height-header 0 3rem 0;
    min-height: calc(100vh - $height-header);
    @include mobile {
        margin-left: 2px;
        margin-right: 2px;
    }
    @media screen and (min-width: 1920px) {
        max-width: 1920px;
        margin-left: auto;
        margin-right: auto;
    }
}
</style>
