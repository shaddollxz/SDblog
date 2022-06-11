import { ProbabilityTheory } from "./ProbilityTheory";
import type { Card } from "./Card";

interface CurrentMsg {
    count: number[]; // 这个组合对应的卡片数
    all: number; // 这个组合的卡片的数量总数
    useHand: number; // 这个组合实际的起手数
    combine: number; //
}

export default class CardAnalyze {
    protected allCombines: number;
    mainPossiable: number;
    possibles: [count: number[], possible: number][]; // count: 对应names指定的卡名的数量
    names: string[];

    constructor(public deckSize: number, public handSize: number, cards: Card[]) {
        // 卡组抽出的所有组合
        this.allCombines = ProbabilityTheory.C(deckSize, handSize);

        // 过滤掉总数为0的卡
        cards = cards.filter((item) => item.all > 0);

        this.names = cards.map((item) => item.name);

        // 每种卡的最小数量到最大数量所有情况的组合
        const cardPossibles = this.getCardPossibles(cards);

        // 每种组合的情况的概率 第一个元素是组合 第二个是组合的概率
        this.possibles = this.combinePossibles(cardPossibles);

        // 总概率
        this.mainPossiable = this.possibles.reduce((pre, cur) => pre + cur[1], 0);
    }

    private getCardPossibles(cards: Card[]) {
        const map = new Map<Card, number[]>();

        for (const card of cards) {
            for (let i = card.min; i <= card.max; i++) {
                const mapCard = map.get(card);
                const combines = ProbabilityTheory.C(card.all, i);
                if (mapCard) {
                    mapCard.push(combines);
                } else {
                    map.set(card, [combines]);
                }
            }
        }
        return map;
    }

    private combinePossibles(possibles: Map<Card, number[]>): CardAnalyze["possibles"] {
        const arr: [Card, number[]][] = [];

        for (const item of possibles.entries()) {
            arr.push(item);
        }

        const res = arr.reduce((pre, cur) => this.getMulti(pre, cur), [] as CurrentMsg[]);

        // 计算每种组合的概率
        return res.map((item) => [
            item.count,
            (item.combine * ProbabilityTheory.C(this.deckSize - item.all, this.handSize - item.useHand)) /
                this.allCombines,
        ]);
    }

    // 获得一种组合的各种信息
    private getMulti(arr1: CurrentMsg[], arr2: [Card, number[]]): CurrentMsg[] {
        const result: CurrentMsg[] = [];

        if (arr1.length == 0) {
            // 初始化 将一张卡片的最小期待数到最大期待数的情况列出
            for (let i = 0; i < arr2[1].length; i++) {
                result.push({
                    count: [arr2[0].min + i],
                    all: arr2[0].all,
                    useHand: arr2[0].min + i,
                    combine: arr2[1][i],
                });
            }
        } else {
            for (let i = 0; i < arr1.length; i++) {
                for (let j = 0; j < arr2[1].length; j++) {
                    const useHand = arr1[i].useHand + arr2[0].min + j;
                    if (useHand > this.handSize) continue;

                    result.push({
                        count: arr1[i].count.concat(arr2[0].min + j),
                        all: arr1[i].all + arr2[0].all,
                        useHand,
                        combine: arr1[i].combine * arr2[1][j],
                    });
                }
            }
        }

        return result;
    }
}
