import { AKStorage } from "@/storages/arKnight";
import type { AKStorageInterface } from "@/storages/arKnight";
import type { RecruitInfo } from "@blog/server";

// 限定池
export const limitList = ["斩荆辟路"];

interface Result {
    lastSix: number; // 普通池距离上一个六星
    isHaveSix: boolean; // 这次分析的普通池数据中是否有六星 用来和以前的数据进行拼接使用
    lastSix_limit: Record<string, number>;
    isHaveSix_limit: Record<string, boolean>;
    counts: Record<
        string,
        {
            3: number;
            4: number;
            5: number;
            6: number;
        }
    >; // 所有数据整合
}

export function nearData(list: RecruitInfo["list"], count: number) {
    const result: RecruitInfo["list"][number]["chars"] = [];
    for (const draw of list) {
        if (result.length >= count) break;
        for (const char of draw.chars) {
            if (result.length >= count) break;
            result.push(char);
        }
    }
    return result;
}

export function analyzeData(list: RecruitInfo["list"]) {
    // 是否为新数据已经由后端进行筛选了

    const result: Result = {
        lastSix: 0,
        isHaveSix: false,
        lastSix_limit: {},
        isHaveSix_limit: {},
        counts: {},
    };

    if (list.length == 0) return result;

    const pools: Record<string, { name: string; rarity: number }[]> = {};
    for (const draw of list) {
        const poolName = draw.pool;
        result.counts[poolName] ? null : (result.counts[poolName] = { 3: 0, 4: 0, 5: 0, 6: 0 });
        const operators = draw.chars.map((char) => {
            result.counts[poolName][char.rarity + 1]++;
            return { name: char.name, rarity: char.rarity };
        });
        if (pools[poolName]) {
            pools[poolName].push(...operators);
        } else {
            pools[poolName] = operators;
        }
    }

    const keys = Object.keys(pools);
    for (let n = 0; n < keys.length; n++) {
        const poolName = keys[n];
        if (limitList.includes(poolName)) {
            result.lastSix_limit[poolName] = 0;
            result.isHaveSix_limit[poolName] = false;
            // 限定池
            if (!result.isHaveSix_limit[poolName]) {
                for (let i = 0; i < pools[poolName].length; i++) {
                    if (pools[poolName][i].rarity == 5) {
                        result.lastSix_limit[poolName] = i;
                        result.isHaveSix_limit[poolName] = true;
                        break;
                    }
                }
                if (result.isHaveSix_limit[poolName]) {
                    result.lastSix_limit[poolName] += pools[poolName].length;
                }
            }
        } else {
            // 非限定池
            if (!result.isHaveSix) {
                for (let i = 0; i < pools[poolName].length; i++) {
                    if (pools[poolName][i].rarity == 5) {
                        result.lastSix += i;
                        result.isHaveSix = true;
                        break;
                    }
                }
                result.lastSix += pools[poolName].length;
            }
        }
    }
    return result;
}

export function compareData(result: Result): Pick<AKStorageInterface, "lastSixData" | "starData"> {
    const recruitData = AKStorage.getItem("starData");
    const analyzed = AKStorage.getItem("lastSixData");

    if (recruitData) {
        for (let key in result.counts) {
            if (recruitData[key]) {
                [3, 4, 5, 6].forEach((num) => {
                    recruitData[key][num] += result.counts[key][num];
                });
            } else {
                recruitData[key] = result.counts[key];
            }
        }
    }
    if (analyzed) {
        for (let key in result.lastSix_limit) {
            if (analyzed.lastSix_limit[key]) {
                analyzed.lastSix_limit[key] = result.isHaveSix_limit[key]
                    ? result.lastSix_limit[key]
                    : analyzed.lastSix_limit[key] + result.lastSix_limit[key];
            } else {
                analyzed.lastSix_limit[key] = result.lastSix_limit[key];
            }
        }
        analyzed.lastSix = result.isHaveSix ? result.lastSix : analyzed.lastSix + result.lastSix;
    }

    return {
        starData: recruitData || result.counts,
        lastSixData: analyzed || { lastSix: result.lastSix, lastSix_limit: result.lastSix_limit },
    };
}
