<template>
    <ProgressBar></ProgressBar>
    <AppHeader></AppHeader>
    <main>
        <RouterView v-slot="{ Component, route }">
            <KeepAlive>
                <component :is="Component" v-if="route.meta.keepAlive" :key="route.path" />
            </KeepAlive>
            <component :is="Component" v-if="!route.meta.keepAlive" :key="route.path" />
        </RouterView>
    </main>
    <AppFooter></AppFooter>

    <GoTop></GoTop>
    <Live2D v-if="!isMobile"></Live2D>
</template>

<script setup lang="ts">
import token from "@/storages/token";
import { useTagStore } from "@/store/tags";
import { useUserStore } from "@/store/user";
import isMobile from "./utils/isMobile";
import AppFooter from "./views/Layout/AppFooter.vue";
import AppHeader from "./views/Layout/AppHeader/index.vue";
import GoTop from "./views/Layout/GoTop.vue";
import ProgressBar from "./views/Layout/ProgressBar.vue";
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
header,
footer {
    height: $height-header;
}
main {
    margin: $height-header + $gap-xlarge 0 $gap-xlarge 0;
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
