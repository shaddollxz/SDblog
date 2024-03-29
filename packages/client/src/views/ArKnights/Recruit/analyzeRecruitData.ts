import type { DrawTableType } from "@/db/arKnights";
import { useDrawTable, isCharData } from "@/db/arKnights";
import type { AKStorageInterface } from "@/storages/arKnights";
import { AKStorage } from "@/storages/arKnights";
import { objectAdd } from "@/utils/objectMath";
import type { RecruitInfo, RecruitListItem } from "@blog/server";
import { isEmpty } from "sdt3";

// 限定池
const limitList = "斩荆辟路";
export function isLimit(poolName: string) {
    return new RegExp(poolName).test(limitList);
}

interface Result {
    lastSix: number; // 普通池距离上一个六星
    isHaveSix: boolean; // 这次分析的普通池数据中是否有六星 用来和以前的数据进行拼接使用
    lastSix_limit: Record<string, number>;
    isHaveSix_limit: Record<string, boolean>;
    newPools: string; // 新卡池的卡池名 空格隔开 也可以不隔
    counts: Record<string, DrawTableType["star"]>; // 每个池子的星数记录
}

export async function analyzeData(list: RecruitInfo["list"]) {
    // 是否为新数据已经由后端进行筛选了
    const result: Result = {
        lastSix: 0,
        isHaveSix: false,
        lastSix_limit: {},
        isHaveSix_limit: {},
        newPools: "",
        counts: {},
    };
    if (list.length == 0) return result;

    const currentFlag = AKStorage.getItem("currentFlag");
    if (!currentFlag) return result;

    // 整理新数据里的角色和星级 并更新数据库中卡池数据
    const pools: Record<string, DrawTableType["operators"]> = {};
    const counts: Result["counts"] = {};
    for (const draw of list) {
        const poolName = draw.pool;
        counts[poolName] ? null : (counts[poolName] = { 3: 0, 4: 0, 5: 0, 6: 0 });
        for (const char of draw.chars) {
            counts[poolName][char.rarity + 1]++;
        }
        if (pools[poolName]) {
            pools[poolName].push(draw.ts);
            pools[poolName].push(...draw.chars);
        } else {
            pools[poolName] = [draw.ts, ...draw.chars];
        }
    }
    result.counts = counts;
    const drawTable = await useDrawTable(currentFlag);
    const allkeys = await drawTable.getAllKeys();
    for (let poolName in pools) {
        if (allkeys.includes(poolName)) {
            await drawTable.findByKeypathAndUpdate(poolName, {
                $unshift: { operators: pools[poolName] },
            });
            const ts = pools[poolName][0];
            if (typeof ts == "number") {
                await drawTable.findByKeypathAndUpdate(poolName, { $set: { ts } });
            }
        } else {
            result.newPools += poolName + " ";
            await drawTable.insert({
                poolName,
                star: { 3: 0, 4: 0, 5: 0, 6: 0 },
                operators: pools[poolName],
                ts: pools[0] as unknown as number,
            });
        }
    }

    // 计算保底数据
    const keys = Object.keys(pools);
    for (let n = 0; n < keys.length; n++) {
        const poolName = keys[n];
        const poolChars = pools[poolName];
        if (isLimit(poolName)) {
            // 限定池
            result.lastSix_limit[poolName] = 0;
            result.isHaveSix_limit[poolName] = false;
            for (let i = 0; i < poolChars.length; i++) {
                const charData = poolChars[i];
                if (isCharData(charData)) {
                    if (charData.rarity == 5) {
                        result.isHaveSix_limit[poolName] = true;
                        break;
                    } else {
                        result.lastSix_limit[poolName]++;
                    }
                }
            }
            if (!result.isHaveSix_limit[poolName]) {
                result.lastSix_limit[poolName] += poolChars.length;
            }
        } else {
            // 非限定池
            if (!result.isHaveSix) {
                for (let i = 0; i < poolChars.length; i++) {
                    const charData = poolChars[i];
                    if (isCharData(charData)) {
                        if (charData.rarity == 5) {
                            result.isHaveSix = true;
                            break;
                        } else {
                            result.lastSix++;
                        }
                    }
                }
            }
        }
    }
    return result;
}

interface ExportData {
    lastSixData: AKStorageInterface["poolData"][string]["lastSixData"];
    starData: Result["counts"];
}

export async function freshData(result: Result): Promise<ExportData> {
    const currentFlag = AKStorage.getItem("currentFlag") as string;
    const drawTable = await useDrawTable(currentFlag);
    const drawData = drawTable.keypathObj(await drawTable.findAll());

    const lastSixData = AKStorage.getItem("poolData")?.[currentFlag]?.lastSixData;

    // 更新卡池星级记录
    const starData: Result["counts"] = {};
    if (drawData) {
        for (let poolName in result.counts) {
            if (new RegExp(poolName).test(result.newPools)) {
                // 是新卡池 直接把统计复制过来
                starData[poolName] = result.counts[poolName];
            } else {
                // 旧卡池 加上新的数据
                // @ts-ignore
                starData[poolName] = objectAdd(drawData[poolName].star, result.counts[poolName]);
            }
            await drawTable.findByKeypathAndUpdate(poolName, { $set: { star: starData[poolName] } });
        }
    }
    // 更新上次保底数据
    if (lastSixData) {
        for (let key in result.lastSix_limit) {
            if (lastSixData.lastSix_limit[key]) {
                lastSixData.lastSix_limit[key] = result.isHaveSix_limit[key]
                    ? result.lastSix_limit[key]
                    : lastSixData.lastSix_limit[key] + result.lastSix_limit[key];
            } else {
                lastSixData.lastSix_limit[key] = result.lastSix_limit[key];
            }
        }
        lastSixData.lastSix = result.isHaveSix ? result.lastSix : lastSixData.lastSix + result.lastSix;
    }

    return {
        starData: isEmpty(starData) ? result.counts : starData,
        lastSixData: lastSixData || { lastSix: result.lastSix, lastSix_limit: result.lastSix_limit },
    };
}
