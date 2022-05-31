import { ProbabilityTheory } from "./ProbilityTheory";

export interface Card {
    name: string;
    all: number; // 总数
    min: number; // 最小期待上手数
    max: number; // 最大期待上手数
}
interface CurrentMsg {
    count: number[];
    all: number;
    useHand: number;
    combine: number;
}

export default class CardAnalyze {
    protected allCombines: number;
    mainPossiable: number;
    possibles: [count: number[], possible: number][]; // count: 对应names指定的卡名的数量
    names: string[];

    constructor(public deckSize: number, public handSize: number, cards: Card[]) {
        // 卡组抽出的所有组合
        this.allCombines = ProbabilityTheory.C(deckSize, handSize);

        this.names = cards.map((item) => item.name);

        const cardPossibles = this.getCardPossibles(cards);

        this.possibles = this.combinePossibles(cardPossibles);

        this.mainPossiable = this.possibles.reduce((pre, cur) => pre + cur[1], 0);
    }

    private getCardPossibles(cards: Card[]) {
        // 每种卡的最小数量到最大数量所有情况的组合
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

        return res.map((item) => [
            item.count,
            (item.combine * ProbabilityTheory.C(this.deckSize - item.all, this.handSize - item.useHand)) /
                this.allCombines,
        ]);
    }

    private getMulti(arr1: CurrentMsg[], arr2: [Card, number[]]): CurrentMsg[] {
        const result: CurrentMsg[] = [];

        if (arr1.length == 0) {
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
