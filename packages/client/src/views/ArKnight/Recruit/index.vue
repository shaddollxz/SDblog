<template>
    <div class="recruit"></div>
</template>

<script setup lang="ts">
import { recruitApi } from "@apis";
import { AKStorage } from "@/storages/arKnight";

// 限定池
const limitList = [{ name: "", bg: "" }];

onMounted(async () => {
    const token = AKStorage.getItem("ak_token");
    if (token) {
        const { data } = await recruitApi({ page: 1, token, channelId: 1 });
        //todo 对数据进行处理 如显示限定 记录已抽次数 据上次六星次数
    }
});

function uploadData() {
    //todo 上传数据到服务器
}
</script>

<style lang="scss" scoped></style>
