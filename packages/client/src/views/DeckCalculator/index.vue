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
                        <tr v-for="(item, index) of cards" :key="item.id">
                            <td><input type="text" v-model="item.name" class="cardName" /></td>
                            <td><input type="text" v-model="item.all" /></td>
                            <td><input type="text" v-model="item.min" /></td>
                            <td><input type="text" v-model="item.max" /></td>
                            <td>
                                <strong @click="removeCard(index)" class="canClick gusto-button">✖</strong>
                            </td>
                        </tr>
                    </table>
                    <div class="add gusto-button" @click="addCard">+ 添加</div>
                </div>
            </div>
            <div class="result" v-show="!!calulatorResult">
                <span class="total">
                    计算结果:{{ $formatNumber(calulatorResult!.mainPossiable * 100, precision, false) + "%" }}
                </span>
                <span>&nbsp;具体概率分布见下表</span>
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
import CheckInput from "@/components/CheckInput";
import type { CheckRules } from "@/components/CheckInput";
import CardAnalyze from "./utils/CardAnalyze";
import type { Card } from "./utils/CardAnalyze";
import Table from "./Table.vue";

const inputs = reactive({
    deckSize: 40,
    handSize: 5,
});

let lastId = 0;
const cards = reactive<(Card & { id: number })[]>([{ id: lastId++, name: "一张卡", all: 3, min: 1, max: 3 }]);
function removeCard(index: number) {
    cards.splice(index, 1);
}
function addCard() {
    cards.push({ id: lastId++, name: "", all: 3, min: 1, max: 3 });
}

const calulatorResult = computed(() => {
    return new CardAnalyze(inputs.deckSize, inputs.handSize, cards);
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
                            .cardName {
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
