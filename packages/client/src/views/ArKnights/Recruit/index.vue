<template>
    <div class="recruit">
        <div class="left gusto-flex-center-col">
            <div class="pie" ref="pieDom"></div>
            <div class="gusto-button" @click="isShowTokenPoppop = true">
                <span>token管理</span>
                <SvgIcon name="replyBox-help"></SvgIcon>
            </div>
        </div>

        <div class="dataAnalyze">
            <div class="distribution">
                <p>保底记录</p>
                <span>自记录开始普通寻访已{{ lastSixData.lastSix }}发没有六星</span>
                <span>（限定池的记录请在下面查阅）</span>
            </div>

            <div class="distribution">
                <p>平均出货统计</p>
                <!-- prettier-ignore -->
                <span>
                    六星平均{{ allStarData[6] === 0 ? 0 : SDMath.ceil(SDMath.div(allDraw, allStarData[6]), 2) }}发
                </span>
                <!-- prettier-ignore -->
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

            <div class="distribution">
                <p>单个卡池分析（打开查看饼图分析）</p>
                <DropDown
                    v-for="(value, name) in starData"
                    lazyRender
                    @onOpen="() => getPoolDrawDataAndSetChart(name)"
                >
                    <template #title>
                        <div class="title">
                            <div>{{ name }}</div>
                            <div class="limit" v-if="isLimit(name)">限定</div>
                        </div>
                    </template>
                    <template #content>
                        <div class="starData">
                            <span v-if="isLimit(name)">
                                该卡池中距离上一个六星已有{{ lastSixData.lastSix_limit[name] }}抽
                            </span>
                            <span>合计{{ [6, 5, 4, 3].reduce((pre, cur) => pre + value[cur], 0) }}发</span>
                            <span v-for="(count, rarity) in value" :class="`rarity-${rarity - 1}`">
                                {{ rarity }}星{{ count }}个
                            </span>
                        </div>
                        <div class="drawData">
                            <div class="charsDetail" v-for="(chars, time) in poolDrawData[name]">
                                <div class="time">{{ time }}</div>
                                <div class="chars">
                                    <div
                                        v-for="char of chars"
                                        class="char gusto-tagBox"
                                        :class="`rarity-${char.rarity}`"
                                    >
                                        {{ char.name }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </DropDown>
            </div>
        </div>
    </div>
    <div v-show="isShowTokenPoppop" class="shady gusto-flex-center">
        <TokenPoppop @onEnsure="onEnsure" @onExit="onExit"></TokenPoppop>
    </div>
</template>

<script setup lang="ts">
import type { DrawTableType } from "@/db/arKnights";
import { useDrawTable, operatorsWithTime } from "@/db/arKnights";
import type { AKStorageInterface } from "@/storages/arKnights";
import { AKStorage } from "@/storages/arKnights";
import type { ECOptions } from "@/utils/Echarts";
import Echarts from "@/utils/Echarts";
import { objectAdd } from "@/utils/objectMath";
import { recruitApi } from "@apis";
import { isSame, SDMath } from "sdt3";
import { analyzeData, freshData, isLimit } from "./analyzeRecruitData";
import TokenPoppop from "./TokenPoppop.vue";
import type { RecruitListItem } from "@blog/server";

// #region 填写token
const isShowTokenPoppop = ref(false);
onMounted(() => {
    const userData = AKStorage.getItem("userData");
    if (!userData) {
        isShowTokenPoppop.value = true;
    }
});
async function onEnsure(token: string, channelId: number, flag: string) {
    isShowTokenPoppop.value = false;
    const userData = AKStorage.getItem("userData");
    const newUserData = { ak_token: token, channelId };
    if (AKStorage.getItem("currentFlag") == flag && isSame(userData?.[flag], newUserData)) return;

    if (userData) {
        userData[flag] = newUserData;
        AKStorage.setItem("userData", userData);
    } else {
        AKStorage.setItem("userData", { [flag]: newUserData });
    }
    AKStorage.setItem("currentFlag", flag);
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
const lastSixData = shallowRef<AKStorageInterface["poolData"][string]["lastSixData"]>({
    lastSix: 0,
    lastSix_limit: {},
});
// 所有收集数据的统计
const allStarData = shallowRef<DrawTableType["star"]>({ 3: 0, 4: 0, 5: 0, 6: 0 });
const allDraw = ref(0);
// 每个卡池的抽卡结果
const poolDrawData = shallowReactive<Record<string, Record<string, RecruitListItem["chars"]>>>({});

onMounted(getAndAnalyzedData);

async function getAndAnalyzedData() {
    const allUserData = AKStorage.getItem("userData");
    const currentFlag = AKStorage.getItem("currentFlag");
    if (!currentFlag) return;

    if (allUserData && currentFlag && allUserData[currentFlag]) {
        const userData = allUserData[currentFlag];
        const poolData = AKStorage.getItem("poolData");
        const lastTs = poolData?.[currentFlag]?.lastTs;
        const { data } = await recruitApi({
            lastTs: lastTs ? lastTs : undefined,
            token: userData.ak_token,
            channelId: userData.channelId,
        });

        const _recruitData = await freshData(await analyzeData(data.list)); // 对新数据进行分析 与以前数据进行拼接
        starData.value = _recruitData.starData;
        lastSixData.value = _recruitData.lastSixData;

        if (poolData) {
            // @ts-ignore
            poolData[currentFlag] = {};
            poolData[currentFlag].lastSixData = _recruitData.lastSixData;
            data.list[0] && (poolData[currentFlag].lastTs = data.list[0].ts);
            AKStorage.setItem("poolData", poolData);
        } else {
            AKStorage.setItem("poolData", {
                [currentFlag]: {
                    lastTs: data.list[0].ts,
                    lastSixData: _recruitData.lastSixData,
                },
            });
        }
    }
    const drawTable = await useDrawTable(currentFlag);
    const drawStarData = (await drawTable.findAll()).map((table) => table.star);
    if (drawStarData.length) {
        if (pieDom.value) {
            chart = Echarts.init(pieDom.value, void 0, { renderer: "svg" });
            const chartData = objectAdd(...drawStarData) as DrawTableType["star"];
            allStarData.value = chartData;
            allDraw.value = [6, 5, 4, 3].reduce((pre, cur) => pre + chartData[cur], 0);
            setChart(chartData);
        }
    }
}

function setChart(chartData: DrawTableType["star"]) {
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
async function getPoolDrawDataAndSetChart(poolName: string) {
    if (!poolDrawData[poolName]) {
        const currentFlag = AKStorage.getItem("currentFlag");
        if (!currentFlag) return;
        const drawTable = await useDrawTable(currentFlag);
        const poolData = await drawTable.findByKeypath(poolName);
        if (poolData[0]) {
            const drawDataWithTime = operatorsWithTime(poolData[0].operators);
            poolDrawData[poolName] = drawDataWithTime;
        }
    }
    setChart(starData[poolName]);
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
    background-color: #00000069;
    z-index: 998;
    .tokenPoppop {
        width: 33%;
        height: 70%;
        overflow-y: scroll;
        @include mobile {
            width: 100%;
        }
    }
}
.recruit {
    display: flex;
    align-items: flex-start;
    gap: $gap-large;
    height: 100%;
    padding: $gap-large;
    @include mobile {
        flex-direction: column;
        .left {
            .pie {
                width: 100%;
            }
        }
    }
    .left {
        flex: 0 1 55%;
        gap: $gap;
        .pie {
            width: 100%;
            height: 20rem;
        }
    }
    .dataAnalyze {
        width: 100%;
        .distribution {
            margin-bottom: $gap-large;
            p {
                font-size: var(--fontsize-big);
            }
            .dropDown {
                padding: 0.3rem 0;
                border-top: var(--color-text-default) solid 0.3rem;
                margin-bottom: $gap-big;
                width: 100%;
            }
            .title {
                display: flex;
                gap: $gap-xxlarge;
            }
            .starData {
                margin: $gap-big 0;
            }
            .drawData {
                .charsDetail {
                    display: flex;
                    align-items: center;
                    gap: $gap-big;
                    margin-bottom: $gap-big;
                    font-size: var(--fontsize-small);
                    .time {
                        flex: 0 0 auto;
                    }
                    .chars {
                        .char {
                            --fontsize: var(--fontsize-small);
                            float: left;
                            margin: 0 $gap 0 0;
                        }
                    }
                }
            }
        }
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
.limit {
    padding: 0 0.8rem;
    text-align: center;
    // background: linear-gradient(to left, red, blue);
}
</style>
