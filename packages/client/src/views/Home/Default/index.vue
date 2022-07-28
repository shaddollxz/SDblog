<template>
    <BlogCardList v-if="!!blogList.length" :blogList="blogList"></BlogCardList>
    <NoData class="gusto-border" v-else></NoData>
    <SplitPage
        v-model="blogList"
        @getNewData="getNewData"
        @onPageChange="pageChange"
        :limit="6"
        :currentPage="route.query.page ? +route.query.page : 1"
        :totalPage="allPage"
    ></SplitPage>
</template>

<script setup lang="ts">
import BlogCardList from "@/components/BlogCardList/index.vue";
import NoData from "@/components/NoData/index.vue";
import { homePageBlogListApi } from "@apis";
import type { BlogListItemInfo } from "@blog/server";

const router = useRouter();
const route = useRoute();

const blogList = shallowRef<BlogListItemInfo[]>([]);
let allPage = ref(0);

function pageChange(page: number | NumberString = 1) {
    router.push({ path: route.path, query: { page } });
}
//todo 翻页时和挂载时触发
function getNewData(page: number | NumberString = 1) {
    homePageBlogListApi(page).then(({ data }) => {
        blogList.value = data.blogList;
        allPage.value = data.allPage;
    });
}
onMounted(() => getNewData(route.query.page as NumberString));
</script>

<style lang="scss" scoped>
.blogCardList {
    width: 100%;
}
.splitPage {
    width: 100%;
    margin: 1rem 0;
}
</style>
