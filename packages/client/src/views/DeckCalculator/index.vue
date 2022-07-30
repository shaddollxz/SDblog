<template>
    <div class="deckCalculator gusto-flex-center-col">
        <h2>卡手率计算器</h2>
        <div class="main">
            <div class="inputs">
                <div class="base">
                    <div v-for="(item, key) of baseMsg">
                        <span>{{ item.label }}</span>
                        <input
                            type="text"
                            :value="item.value"
                            @input="($event) => checkBaseInput(key)($event)"
                        />
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
                        <tr v-for="(item, index) of cards">
                            <template v-for="(value, key) of item">
                                <td v-if="key != 'id' && typeof value !== 'function'">
                                    <input
                                        type="text"
                                        :value="value"
                                        @input="($event) => checkCardInput(index, key)($event)"
                                    />
                                </td>
                            </template>

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
                    所有可能合计结果:{{
                        $formatNumber(calulatorResult!.mainPossiable * 100, precision, false) + "%"
                    }}
                </span>
                <span>&nbsp;具体概率分布见下表</span>
                <p>
                    <span>注：表中每项代表上手的数量，如：1代表</span>
                    <strong>只</strong>
                    <span>上手一张，2代表同时上手两张，0代表一张都没上手</span>
                </p>
                <DetailTable
                    :names="calulatorResult!.names"
                    :possibles="calulatorResult!.possibles"
                    :precision="precision"
                ></DetailTable>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import CardAnalyze from "./utils/CardAnalyze";
import { Card } from "./utils/Card";
import DetailTable from "./Table.vue";
import { debounce, Message } from "sdt3";

const baseMsg = reactive({
    deckSize: { label: "卡组总数：", value: 40 },
    handSize: { label: "起始手卡：", value: 5 },
});
const defaultCard = ["卡名", 3, 1, 3] as const;

const cards = reactive<Card[]>([new Card(...defaultCard)]) as Card[];
function removeCard(index: number) {
    cards.splice(index, 1);
}
function addCard() {
    cards.push(new Card(...defaultCard));
}

const surplusCard = computed(() => baseMsg.deckSize.value - cards.reduce((pre, cur) => pre + cur.all, 0));
function checkCardInput(index: number, type: Exclude<keyof Card, "id">) {
    const row = cards[index];
    return debounce(
        (e: Event) => {
            const target = e.target as HTMLInputElement;
            if (type == "name") return (row.name = target.value);

            const newData = +target.value;
            if (!Number.isNaN(newData)) {
                row["change" + type](newData, baseMsg.handSize.value);
                target.value = newData as unknown as string;
            } else {
                target.value = "" + row[type];
            }
        },
        600,
        false
    );
}

function checkBaseInput(key: keyof typeof baseMsg) {
    return debounce(
        (e: Event) => {
            const target = e.target as HTMLInputElement;
            const input = +target.value;

            if (!Number.isNaN(input)) {
                const maxHandSize = baseMsg.deckSize.value - cards.length * 2;
                if (key == "handSize" && input > maxHandSize) {
                    return (baseMsg[key].value = maxHandSize);
                }
                baseMsg[key].value = input;
            } else {
                target.value = "" + baseMsg[key].value;
            }
        },
        600,
        false
    );
}

const calulatorResult = computed(() => {
    try {
        return new CardAnalyze(baseMsg.deckSize.value, baseMsg.handSize.value, cards);
    } catch {
        Message.error("参数有误", {
            leaveTo: "left",
            style: {
                marginLeft: 0,
            },
        });
    }
});

const precision = ref(2);
</script>

<style lang="scss" scoped>
.deckCalculator {
    margin-left: $width-wife;
    .main {
        width: 70%;
        .inputs {
            .base {
                display: flex;
                gap: $gap-xxlarge;
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
