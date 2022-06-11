<template>
    <div class="deckCalculator gusto-flex-center">
        <h2>卡手率计算器</h2>
        <div class="main">
            <div class="inputs">
                <div class="base">
                    <div>
                        <span>卡组数量：</span>
                        <input type="text" v-model.number="inputs.deckSize" />
                    </div>
                    <div>
                        <span>手牌数量：</span>
                        <input type="text" v-model.number="inputs.handSize" />
                    </div>
                </div>
                <div class="cards">
                    <table>
                        <tr>
                            <th>卡名</th>
                            <th>数量</th>
                            <th>最小期待数</th>
                            <th>最大期待数</th>
                        </tr>
                        <tr>
                            <td>剩余卡数</td>
                            <td>{{ surplusCard }}</td>
                        </tr>
                        <!-- vfor不能读取getset 只能手动设置 -->
                        <tr v-for="(item, index) of cards">
                            <td>
                                <input
                                    type="text"
                                    :value="item.name"
                                    @input="($event) => checkInput(index, 'name')($event)"
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    :value="item.all"
                                    @input="($event) => checkInput(index, 'all')($event)"
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    :value="item.min"
                                    @input="($event) => checkInput(index, 'min')($event)"
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    :value="item.max"
                                    @input="($event) => checkInput(index, 'max')($event)"
                                />
                            </td>
                            <td>
                                <strong @click="removeCard(index)" class="canClick gusto-button">✖</strong>
                            </td>
                        </tr>
                    </table>
                    <div class="add gusto-button" @click="addCard">+ 添加</div>
                </div>
            </div>
            <div class="result">
                <span class="total">
                    所有可能合计结果:{{ $formatNumber(calulatorResult!.mainPossiable * 100, precision, false) + "%" }}
                </span>
                <span>&nbsp;具体概率分布见下表</span>
                <p>
                    <span>注：表中每项代表上手的数量，如：1代表</span>
                    <strong>只</strong>
                    <span>上手一张，2代表同时上手两张，只有0才代表没有上手</span>
                </p>
                <Table
                    :names="calulatorResult!.names"
                    :possibles="calulatorResult!.possibles"
                    :precision="precision"
                ></Table>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import CardAnalyze from "./utils/CardAnalyze";
import { Card } from "./utils/Card";
import Table from "./Table.vue";
import { debounce, Message } from "sdt3";

const inputs = reactive({
    deckSize: 40,
    handSize: 5,
});

let lastId = 0;
const cards = reactive<Card[]>([new Card(lastId++, "一张卡", 3, 1, 3)]) as Card[];
function removeCard(index: number) {
    cards.splice(index, 1);
}
function addCard() {
    cards.push(new Card(lastId++, "一张卡", 3, 1, 3));
}

const surplusCard = computed(() => inputs.deckSize - cards.reduce((pre, cur) => pre + cur.all, 0));
function checkInput(index: number, type: Exclude<keyof Card, "id">) {
    const row = cards[index];
    return debounce(
        (e: Event) => {
            const target = e.target as HTMLInputElement;
            if (type == "name") return (row.name = target.value);

            const newData = +target.value;
            if (!Number.isNaN(newData)) {
                row[type] = newData;
            }
            target.value = newData as unknown as string;
        },
        600,
        false
    );
}

const calulatorResult = computed(() => {
    try {
        return new CardAnalyze(inputs.deckSize, inputs.handSize, cards);
    } catch {
        Message.error("参数有问题，我算不出来啊", {
            leaveTo: "left",
            style: {
                position: "fixed",
                left: "0",
                top: "5rem",
            },
        });
    }
});

const precision = ref(2);
</script>

<style lang="scss" scoped>
.deckCalculator {
    margin-left: $width-wife;
    flex-direction: column;
    .main {
        width: 70%;
        .inputs {
            .base {
                display: flex;
                gap: 3rem;
                margin-bottom: 3rem;
            }
            .cards {
                table {
                    tr {
                        th {
                            width: 10rem;
                        }
                        td {
                            text-align: center;
                            height: 3rem;
                        }
                        td:first-child {
                            input {
                                max-width: 10rem;
                            }
                        }
                    }
                }
                .add {
                    margin: 2rem 30% 4rem auto;
                }
            }
            input {
                max-width: 3rem;
            }
        }
        .result {
            .total {
                font-size: var(--fontsize-big);
            }
            .table {
                margin-top: 3rem;
            }
        }
    }
    @include mobile {
        margin: 0;
        .main {
            width: 100%;
        }
        :deep(.table) {
            table {
                box-sizing: border-box;
                margin: 0 1rem;
                width: calc(100% - 2 * 1rem);
            }
        }
    }
}
</style>
