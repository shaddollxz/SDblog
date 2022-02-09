<template>
    <section class="replys">
        <div class="items">
            <template v-for="item of replyList" :key="item._id">
                <ReplyItem :replyMsg="item"></ReplyItem>
            </template>
        </div>
        <SplitPage
            v-model="replyList"
            :totalPage="allPage"
            :currentPage="$route.query.page ? +$route.query.page : 1"
            @onPageChange="pageChange"
            @getNewData="getNewData"
        ></SplitPage>
    </section>
</template>

<script setup lang="ts">
import { userReplyListApi } from "@apis";
// import type { ReplyItem as ReplyItemData } from "@apis";
import type { ReplyItemInfo } from "@blog/server";
import ReplyItem from "./ReplyItem.vue";

const router = useRouter();
const route = useRoute();

let replyList = shallowRef<ReplyItemInfo[]>([]);
let allPage = ref(0);

function pageChange(page: number | NumberString = 1) {
    router.push({ path: route.path, query: { page } });
}
function getNewData(page: number | NumberString = 1) {
    userReplyListApi(page).then(({ data }) => {
        replyList.value = data.list;
        allPage.value = data.allPage;
    });
}
onMounted(() => getNewData(route.query.page as NumberString));
</script>

<style lang="scss" scoped>
.replys {
    padding: 0 !important;
    display: flex;
    flex-direction: column;
    .items {
        flex: 1;
        overflow-y: scroll;
        .replyItem {
            margin-bottom: 2.2rem;
        }
    }
    .splitPage {
        margin-top: 1rem;
        flex: 0 0 auto;
    }
}
</style>
