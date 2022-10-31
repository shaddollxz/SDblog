<template>
    <div class="recruit">
        <div>距离上一个六星已经抽了{{ recruitData.analyzed.lastSix }}发</div>

        <div class="analyzed">
            <p>抽卡统计</p>
            {{ recruitData }}
        </div>

        <div>
            <p>最近三十条记录</p>
            <p v-for="draw of nearDetailData" :class="'rarity-' + draw.rarity">
                {{ draw.name }}
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { recruitApi } from "@apis";
import type { RecruitInfo } from "@blog/server";
import { AKStorage } from "@/storages/arKnight";
import type { AKStorageInterface } from "@/storages/arKnight";
import { analyzeData, compareData, nearData, limitList, limitBgList } from "./analyzeRecruitData";

// 最近30条抽卡结果
const nearDetailData = shallowRef<RecruitInfo["list"][number]["chars"]>([]);
// 分析结果
const recruitData = shallowRef<Pick<AKStorageInterface, "recruitData" | "analyzed">>({
    recruitData: {},
    analyzed: { lastSix: 0, lastSix_limit: {} },
});

onMounted(async () => {
    AKStorage.setItem("userData", { ak_token: "EXS6f2mN7Ji3lrsSZSenEk8X", channelId: 1 });
    AKStorage.removeItem("lastTs");

    const userData = AKStorage.getItem("userData");

    if (userData) {
        const { data } = await recruitApi({
            page: 1,
            token: userData.ak_token,
            channelId: userData.channelId,
        });

        // 对新数据进行分析 与以前数据进行拼接
        nearDetailData.value = nearData(data.list, 30);
        recruitData.value = compareData(analyzeData(data.list));

        AKStorage.setItem("lastTs", data.list[0].ts);
        AKStorage.setItem("analyzed", recruitData.value.analyzed);
        AKStorage.setItem("recruitData", recruitData.value.recruitData);
        AKStorage.setItem("near30Operator", nearDetailData.value);
    }
});

function uploadData() {
    //todo 上传数据到服务器
}
</script>

<style lang="scss" scoped>
.recruit {
}

.rarity-3 {
    color: #a231ff;
}
.rarity-4 {
    color: #cc7a00;
}
.rarity-5 {
    color: red;
}
</style>
