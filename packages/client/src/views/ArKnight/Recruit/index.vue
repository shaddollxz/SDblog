<template>
    <div class="recruit">
        <div class="statistics">
            <div class="pie" ref="pieDom"></div>
        </div>

        <div>
            <p>保底记录</p>
            <span>自记录开始普通寻访已{{ lastSixData.lastSix }}发没有六星</span>
            <span v-for="(drawed, name) of lastSixData.lastSix_limit">
                自记录开始限定寻访{{ name }}已{{ drawed }}发没有六星
            </span>
            <p>平均出货统计</p>
            <span>
                六星平均{{ allStarData[6] === 0 ? 0 : SDMath.ceil(SDMath.div(allDraw, allStarData[6]), 2) }}发
            </span>
            <span>
                五星平均{{ allStarData[5] === 0 ? 0 : SDMath.ceil(SDMath.div(allDraw, allStarData[5]), 2) }}发
            </span>
        </div>

        <div class="distribution">
            <p>抽卡统计</p>
            <span>合计{{ allDraw }}发</span>
            <span v-for="(count, rarity) in allStarData" :class="`rarity-${rarity - 1}`">
                {{ rarity }}星{{ count }}个
            </span>
        </div>

        <div>
            <p>单个卡池分析（点击查看饼图分析）</p>
            <div
                v-for="(value, name) in starData"
                class="distribution"
                @click="() => setChartData(starData[name])"
            >
                <p>
                    <span>卡池名：{{ name }}</span>
                    <span class="limit" v-show="limitList.includes(name as string)">限定</span>
                </p>

                <span>合计{{ [6, 5, 4, 3].reduce((pre, cur) => pre + value[cur], 0) }}发</span>
                <span v-for="(count, rarity) in value" :class="`rarity-${rarity - 1}`">
                    {{ rarity }}星{{ count }}个
                </span>
            </div>
        </div>

        <div>
            <p>最近三十条记录</p>
            <span v-for="draw of nearDetailData" :class="`rarity-${draw.rarity}`">{{ draw.name }}&nbsp;</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { recruitApi } from "@apis";
import type { RecruitInfo } from "@blog/server";
import Echarts from "@/utils/Echarts";
import type { ECOptions } from "@/utils/Echarts";
import { objectAdd } from "@/utils/objectMath";
import { SDMath } from "sdt3";
import { AKStorage } from "@/storages/arKnight";
import type { AKStorageInterface } from "@/storages/arKnight";
import { analyzeData, compareData, nearData, limitList, limitBgList } from "./analyzeRecruitData";

const pieDom = shallowRef<HTMLDivElement | null>(null);
let chart: Echarts.ECharts;

// 最近30条抽卡结果
const nearDetailData = shallowRef<RecruitInfo["list"][number]["chars"]>([]);
// 每个卡池的星数分布和卡池距上次六星抽数
const starData = shallowRef<AKStorageInterface["starData"]>({});
const lastSixData = shallowRef<AKStorageInterface["lastSixData"]>({ lastSix: 0, lastSix_limit: {} });
const allStarData = shallowRef<AKStorageInterface["starData"][string]>({ 3: 0, 4: 0, 5: 0, 6: 0 });
const allDraw = ref(0);
const currentLimitPool = ref("");

onMounted(async () => {
    AKStorage.setItem("userData", { ak_token: "EXS6f2mN7Ji3lrsSZSenEk8X", channelId: 1 });
    // AKStorage.removeItem("lastTs");
    const userData = AKStorage.getItem("userData");

    if (userData) {
        const lastTs = AKStorage.getItem("lastTs");
        const { data } = await recruitApi({
            lastTs: lastTs ? lastTs : undefined,
            token: userData.ak_token,
            channelId: userData.channelId,
        });

        const _nearDetailData = nearData(data.list, 30);
        const _recruitData = compareData(analyzeData(data.list)); // 对新数据进行分析 与以前数据进行拼接

        starData.value = _recruitData.starData;
        lastSixData.value = _recruitData.lastSixData;
        nearDetailData.value = _nearDetailData;

        data.list[0] && AKStorage.setItem("lastTs", data.list[0].ts);
        AKStorage.setItem("starData", _recruitData.starData);
        AKStorage.setItem("lastSixData", _recruitData.lastSixData);
        AKStorage.setItem("near30Operator", _nearDetailData);
    }

    const drawStarData = AKStorage.getItem("starData");

    if (drawStarData) {
        if (pieDom.value) {
            chart = Echarts.init(pieDom.value, void 0, { renderer: "svg" });
            const chartData = objectAdd(
                ...Object.keys(drawStarData).map((key) => drawStarData[key])
            ) as AKStorageInterface["starData"][string];
            allStarData.value = chartData;
            allDraw.value = [6, 5, 4, 3].reduce((pre, cur) => pre + chartData[cur], 0);
            setChartData(chartData);
        }
    }
});

function uploadData() {
    //todo 上传数据到服务器
}

function setChartData(chartData: Record<string, number>) {
    if (chart) {
        const result: { value: number; name: string }[] = [];
        for (let key in chartData) {
            result.push({ value: chartData[key], name: `${key}星` });
        }

        chart.setOption<ECOptions>({
            series: [
                {
                    type: "pie",
                    name: "所有记录统计",
                    radius: "93%",
                    stillShowZeroSum: false,
                    percentPrecision: 2,
                    color: ["#158fc5", "#a231ff", "#cc7a00", "#ee5700"],
                    label: {
                        formatter: (options) => `${options.name} ${options.percent}%`,
                        color: "var(--color-text-default)",
                    },
                    data: result,
                },
            ],
        });
    }
}
</script>

<style lang="scss" scoped>
.recruit {
    .statistics {
        width: 100%;
        height: 20rem;
        .pie {
            width: 50%;
            height: 80%;
        }
    }
}

.rarity-2 {
    color: #158fc5;
}
.rarity-3 {
    color: #a231ff;
}
.rarity-4 {
    color: #cc7a00;
}
.rarity-5 {
    color: #ee5700;
}
</style>
