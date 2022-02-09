<template>
    <div class="replyList">
        <SendReplyBox
            :replyMainId="$props.replyMainId"
            :type="$props.type"
            @refreshList="refreshList"
        ></SendReplyBox>

        <template v-if="replyList.length" v-for="item of replyList" :key="item._id">
            <ReplyItem
                :refreshList="refreshList"
                :detail="item"
                :replyMainId="$props.replyMainId"
            ></ReplyItem>
        </template>
        <p v-else>还没有评论，来抢个沙发吧~</p>
    </div>
</template>

<script setup lang="ts">
import ReplyItem from "./ReplyItem.vue";
import SendReplyBox from "./SendReplyBox.vue";
import { replyListApi } from "@apis";
import type { ReplyListInfo } from "@blog/server";
import { ReplyEnum } from "@blog/server";

export interface Props {
    replyMainId: string;
    type: ReplyEnum;
}
const props = defineProps<Props>();
provide("replyMainId", props.replyMainId);
provide("type", props.type);

const count = ref(0);
const replyList = shallowRef<ReplyListInfo["replyList"]>([]);
onBeforeMount(() => {
    replyListApi(props.replyMainId).then(({ data }) => {
        replyList.value = data.replyList;
        count.value = data.count;
    });
});

//! 将刷新方法当作props传递给孙级组件
function refreshList(list: ReplyListInfo) {
    replyList.value = list.replyList;
    count.value = list.count;
}

defineExpose({ count });
</script>

<style lang="scss" scoped>
.replyList {
    margin-bottom: 10rem;
    :deep(.sendReplyBox) {
        .sendMarkdown {
            height: 25rem;
        }
    }
    .replyItem {
        width: 85%;
        margin: 0 auto;
    }
    > p {
        width: max-content;
        margin: 4rem auto 0;
        font-size: var(--fontsize-large);
    }
    @media screen and (max-width: 750px) {
        .replyItem {
            width: 100%;
        }
        > p {
            font-size: var(--fontsize-big);
        }
    }
}
</style>
