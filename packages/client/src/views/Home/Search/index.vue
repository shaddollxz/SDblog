<template>
    <BlogCardList v-if="blogList.length" :blogList="blogList"></BlogCardList>
    <NoData v-else></NoData>
    <SplitPage
        v-model="blogList"
        :limit="6"
        :totalPage="allPage"
        :currentPage="route.query.page ? +route.query.page : 1"
        @onPageChange="pageChange"
        @getNewData="getNewData"
    ></SplitPage>
</template>

<script setup lang="ts">
import BlogCardList from "@/components/BlogCardList/index.vue";
import NoData from "@/components/NoData/index.vue";
import { searchBlogByKeyWordApi, searchBlogByTagApi } from "@apis";
import type { BlogListItemInfo } from "@blog/server";
import { onBeforeRouteUpdate } from "vue-router";
import type { RouteLocationNormalizedLoaded } from "vue-router";

import assert from "@/utils/assert";
const router = useRouter();
const route = useRoute();

const blogList = shallowRef<BlogListItemInfo[]>([]);
let allPage = ref(0);
let getNewData: (newPage: number | NumberString) => void;

function search(route: RouteLocationNormalizedLoaded) {
    const { tag, keyWord } = route.query;
    assert(typeof tag === "string");
    assert(typeof keyWord === "string");
    if (tag) {
        getNewData = (newPage) =>
            searchBlogByTagApi({ tag, page: newPage }).then(({ data }) => {
                blogList.value = data.blogList;
                allPage.value = data.allPage;
            });
    } else if (keyWord) {
        getNewData = (newPage) =>
            searchBlogByKeyWordApi({ keyword: keyWord, page: newPage }).then(({ data }) => {
                blogList.value = data.blogList;
                allPage.value = data.allPage;
            });
    } else {
        router.go(-1);
    }

    getNewData((route.query.page as NumberString) ?? 1);
}

function pageChange(page = 1) {
    router.push({ path: route.path, query: Object.assign({}, route.query, { page }) });
}

onBeforeRouteUpdate((to, from, next) => {
    if (
        to.query.tag == from.query.tag &&
        to.query.keyWord == from.query.keyWord &&
        to.query.page == from.query.page
    ) {
        return next(); // 页面url没有改变
    }
    search(to);
    next();
});

onMounted(() => search(route));
</script>

<style lang="scss" scoped>
.blogCardList {
    width: 100%;
    background-color: var(--color-bg-bland);
}
.splitPage {
    width: 100%;
    margin: 1rem 0;
}
</style>
