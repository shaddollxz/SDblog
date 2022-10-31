import { describe, it, expect, vi } from "vitest";
import { analyzeData, compareData, nearData } from "../src/views/ArKnight/Recruit/analyzeRecruitData";

vi.mock("sdt3", async () => {
    return {
        LocalStorage: (await import("../../SDT/src/methods/LocalStorage")).default,
    };
});

const data = [
    {
        ts: 1665481304,
        pool: "轴承与火星",
        chars: [
            {
                name: "蛇屠箱",
                rarity: 3,
                isNew: false,
            },
            {
                name: "杰西卡",
                rarity: 3,
                isNew: false,
            },
            {
                name: "玫兰莎",
                rarity: 2,
                isNew: false,
            },
            {
                name: "守林人",
                rarity: 4,
                isNew: false,
            },
            {
                name: "格雷伊",
                rarity: 3,
                isNew: false,
            },
            {
                name: "霜叶",
                rarity: 3,
                isNew: false,
            },
            {
                name: "清道夫",
                rarity: 3,
                isNew: false,
            },
            {
                name: "地灵",
                rarity: 3,
                isNew: false,
            },
            {
                name: "铅踝",
                rarity: 3,
                isNew: false,
            },
            {
                name: "炎熔",
                rarity: 2,
                isNew: false,
            },
        ],
    },
    {
        ts: 1665476758,
        pool: "轴承与火星aa",
        chars: [
            {
                name: "孑",
                rarity: 3,
                isNew: false,
            },
            {
                name: "月见夜",
                rarity: 2,
                isNew: false,
            },
            {
                name: "炎熔",
                rarity: 2,
                isNew: false,
            },
            {
                name: "铅踝",
                rarity: 3,
                isNew: true,
            },
            {
                name: "深靛",
                rarity: 3,
                isNew: false,
            },
            {
                name: "梓兰",
                rarity: 2,
                isNew: false,
            },
            {
                name: "史都华德",
                rarity: 2,
                isNew: false,
            },
            {
                name: "香草",
                rarity: 2,
                isNew: false,
            },
            {
                name: "桑葚",
                rarity: 4,
                isNew: false,
            },
            {
                name: "调香师",
                rarity: 3,
                isNew: false,
            },
        ],
    },
    {
        ts: 1665476419,
        pool: "轴承与火星aa",
        chars: [
            {
                name: "崖心",
                rarity: 4,
                isNew: false,
            },
        ],
    },
    {
        ts: 1665476412,
        pool: "轴承与火星",
        chars: [
            {
                name: "泡普卡",
                rarity: 2,
                isNew: false,
            },
        ],
    },
    {
        ts: 1665476405,
        pool: "轴承与火星",
        chars: [
            {
                name: "霜叶",
                rarity: 3,
                isNew: false,
            },
        ],
    },
];

describe("nearData", () => {
    it("5条数据", () => {
        const result = nearData(data, 5);
        expect(result).toEqual(data[0].chars.slice(0, 5));
    });

    it("10条数据", () => {
        const result = nearData(data, 10);
        expect(result).toEqual(data[0].chars);
    });

    it("15条数据", () => {
        const result = nearData(data, 15);
        expect(result).toEqual(data[0].chars.concat(data[1].chars.slice(0, 5)));
    });

    it("23条数据", () => {
        const result = nearData(data, 23);
        expect(result).toEqual(
            data[0].chars
                .concat(data[1].chars)
                .concat(data[2].chars)
                .concat(data[3].chars)
                .concat(data[4].chars)
        );
    });
});

describe("analyzeData", () => {
    it("空数组", () => {
        const result = analyzeData([]);
        expect(result).toEqual({
            lastSix: 0,
            isHaveSix: false,
            lastSix_limit: {},
            isHaveSix_limit: {},
            counts: {},
        });
    });

    it("只有10条新数据", () => {
        localStorage.setItem("lastTs", "1665476758");
        const result = analyzeData(data);
        expect(result).toEqual({
            lastSix: 10,
            isHaveSix: false,
            lastSix_limit: {},
            isHaveSix_limit: {},
            counts: { 轴承与火星: { 3: 2, 4: 7, 5: 1, 6: 0 } },
        });
    });
});

describe("compareData", () => {
    it("");
});
