<template>
    <div class="essay gusto-flex-center">
        <SendMarkdown
            ref="sendMarkdown"
            :isCanSend="!!sendMarkdown?.text"
            placeholder="随便说说吧"
            @onSend="sendFunc"
            :delay="30000"
        ></SendMarkdown>
        <EssayList :essayList="essayList" @onDelete="fresh"></EssayList>
        <SplitPage
            :totalPage="allPage"
            :currentPage="+(route.query.page as string) ?? 1"
            @onPageChange="pageChange"
            @getNewData="getNewData"
        ></SplitPage>
    </div>
</template>

<script setup lang="ts">
import SendMarkdown from "@/components/SendMarkdown/index.vue";
import EssayList from "./EssayList.vue";
import { Message } from "sdt3";
import { writeEssayApi, essayListApi } from "@apis";
import type { EssayInfo } from "@blog/server";

const router = useRouter();
const route = useRoute();

let essayList = shallowRef<EssayInfo[]>([]);
let allPage = ref(1);

function fresh(data: { essayList: EssayInfo[]; allPage: number }) {
    essayList.value = data.essayList;
    allPage.value = data.allPage;
}
function getNewData(page: number | NumberString = 1) {
    essayListApi(page as number).then(({ data }) => fresh(data));
}
onMounted(() => getNewData(route.query.page as NumberString));
function pageChange(page = 1) {
    router.push({ path: route.path, query: { page } });
}

const sendMarkdown = shallowRef<InstanceType<typeof SendMarkdown> | null>(null);
function sendFunc() {
    writeEssayApi(sendMarkdown.value!.text, (route?.query?.page as string) ?? "1").then(({ data }) => {
        sendMarkdown.value!.text = "";
        fresh(data);
        Message.success("发送成功");
    });
}
</script>

<style lang="scss" scoped>
.essay {
    margin: calc($height-header + 3rem) $width-wife 0;
    flex-direction: column;
    .sendMarkdown {
        width: 100%;
        height: 20rem;
        margin: 1rem 0 2rem;
    }
    @include mobile {
        margin: 0;
    }
}
</style>
