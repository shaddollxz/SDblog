<template>
    <div v-if="isShowTokenPoppop" class="shady gusto-flex-center">
        <TokenPoppop @onEnsure="onEnsure" @onExit="onExit"></TokenPoppop>
    </div>
    <div class="recruit">
        <div class="pie" ref="pieDom"></div>

        <div class="gusto-button" @click="isShowTokenPoppop = true">
            <span>关于token</span>
            <SvgIcon name="replyBox-help"></SvgIcon>
        </div>

        <div>
            <p>保底记录</p>
            <span>自记录开始普通寻访已{{ lastSixData.lastSix }}发没有六星</span>
            <br />
            <span v-for="name of currentLimitPool">
                自记录开始限定寻访{{ name }}已{{ lastSixData.lastSix_limit[name] }}发没有六星
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
    </div>
</template>

<script setup lang="ts">
import type { DrawTableType } from "@/db/arKnights";
import { useDrawTable } from "@/db/arKnights";
import type { AKStorageInterface } from "@/storages/arKnights";
import { AKStorage } from "@/storages/arKnights";
import type { ECOptions } from "@/utils/Echarts";
import Echarts from "@/utils/Echarts";
import { objectAdd } from "@/utils/objectMath";
import { recruitApi } from "@apis";
import { SDMath } from "sdt3";
import { analyzeData, freshData, limitList } from "./analyzeRecruitData";
import TokenPoppop from "./TokenPoppop.vue";

// #region 填写token
const isShowTokenPoppop = ref(false);
onMounted(() => {
    const userData = AKStorage.getItem("userData");
    if (!userData) {
        isShowTokenPoppop.value = true;
    }
});
async function onEnsure(token: string, channelId: number) {
    AKStorage.setItem("userData", { ak_token: token, channelId });
    isShowTokenPoppop.value = false;
    await getAndAnalyzedData();
}
function onExit() {
    isShowTokenPoppop.value = false;
}
// #endregion

// #region 抽卡数据分析
const pieDom = shallowRef<HTMLDivElement | null>(null);
let chart: Echarts.ECharts;

// 每个卡池的星数分布和卡池距上次六星抽数
const starData = shallowRef<Record<string, DrawTableType["star"]>>({});
const lastSixData = shallowRef<AKStorageInterface["lastSixData"]>({ lastSix: 0, lastSix_limit: {} });
// 所有收集数据的统计
const allStarData = shallowRef<DrawTableType["star"]>({ 3: 0, 4: 0, 5: 0, 6: 0 });
const allDraw = ref(0);
const currentLimitPool = shallowRef<string[]>([]);

onMounted(getAndAnalyzedData);

async function getAndAnalyzedData() {
    const userData = AKStorage.getItem("userData");
    if (userData) {
        const lastTs = AKStorage.getItem("lastTs");
        const { data } = await recruitApi({
            lastTs: lastTs ? lastTs : undefined,
            token: userData.ak_token,
            channelId: userData.channelId,
        });

        const _recruitData = await freshData(await analyzeData(data.list)); // 对新数据进行分析 与以前数据进行拼接
        starData.value = _recruitData.starData;
        lastSixData.value = _recruitData.lastSixData;

        data.list[0] && AKStorage.setItem("lastTs", data.list[0].ts);
        AKStorage.setItem("lastSixData", _recruitData.lastSixData);
        currentLimitPool.value = _recruitData.currentLimitPool;
    }
    const drawTable = await useDrawTable();
    const drawStarData = (await drawTable.findAll()).map((table) => table.star);
    if (drawStarData.length) {
        if (pieDom.value) {
            chart = Echarts.init(pieDom.value, void 0, { renderer: "svg" });
            const chartData = objectAdd(...drawStarData) as DrawTableType["star"];
            allStarData.value = chartData;
            allDraw.value = [6, 5, 4, 3].reduce((pre, cur) => pre + chartData[cur], 0);
            setChartData(chartData);
        }
    }
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
                    color: ["#0493d0", "#a231ff", "#d88303", "#d14e02"],
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
// #endregion

function uploadData() {
    //todo 上传数据到服务器
}
</script>

<style lang="scss" scoped>
.shady {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: #0000004f;
    z-index: 998;
}
.recruit {
    .pie {
        width: 50%;
        height: 20rem;
    }
}

.rarity-2 {
    color: #0493d0;
}
.rarity-3 {
    color: #a231ff;
}
.rarity-4 {
    color: #d88303;
}
.rarity-5 {
    color: #d14e02;
}
</style>
