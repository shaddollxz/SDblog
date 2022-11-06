import type { DrawTableType } from "@/db/arKnights";
import { useDrawTable } from "@/db/arKnights";
import type { AKStorageInterface } from "@/storages/arKnights";
import { AKStorage } from "@/storages/arKnights";
import { objectAdd } from "@/utils/objectMath";
import type { RecruitInfo, RecruitListItem } from "@blog/server";
import { isEmpty } from "sdt3";

// 限定池
export const limitList = ["斩荆辟路"];

interface Result {
    lastSix: number; // 普通池距离上一个六星
    isHaveSix: boolean; // 这次分析的普通池数据中是否有六星 用来和以前的数据进行拼接使用
    lastSix_limit: Record<string, number>;
    isHaveSix_limit: Record<string, boolean>;
    currentLimitPool: string[];
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
        currentLimitPool: [],
        newPools: "",
        counts: {},
    };
    if (list.length == 0) return result;

    const currentFlag = AKStorage.getItem("currentFlag");
    if (!currentFlag) return result;

    const drawTable = await useDrawTable(currentFlag);
    // 整理新数据里的角色和星级 并更新数据库中卡池数据
    const pools: Record<string, { chars: RecruitListItem["chars"]; ts: number }> = {};
    const counts: Result["counts"] = {};
    for (const draw of list) {
        const poolName = draw.pool;
        counts[poolName] ? null : (counts[poolName] = { 3: 0, 4: 0, 5: 0, 6: 0 });
        for (const char of draw.chars) {
            counts[poolName][char.rarity + 1]++;
        }
        if (pools[poolName]) {
            pools[poolName].chars.push(...draw.chars);
            pools[poolName].ts = draw.ts;
        } else {
            pools[poolName] = { chars: draw.chars, ts: draw.ts };
        }
    }
    for (let poolName in pools) {
        const cacheChars = drawTable.keypathObj(await drawTable.findByKeypath(poolName));
        if (cacheChars) {
            // 已有的卡池 只先更新角色和ts 星数分布在下面比对后更新
            const newChars = [...pools[poolName].chars];
            newChars.push(...cacheChars[poolName].operators);
            await drawTable.findByKeypathAndUpdate(poolName, {
                $set: { operators: newChars, ts: pools[poolName].ts },
            });
        } else {
            // 新的卡池 所有数据都插入
            result.newPools += `${poolName} `;
            await drawTable.insert({
                poolName,
                operators: pools[poolName].chars,
                star: counts[poolName],
                ts: pools[poolName].ts,
            });
        }
    }
    result.counts = counts;

    // 计算保底数据
    const keys = Object.keys(pools);
    for (let n = 0; n < keys.length; n++) {
        const poolName = keys[n];
        const poolChars = pools[poolName].chars;
        if (limitList.includes(poolName)) {
            result.currentLimitPool.push(poolName);
            // 限定池
            result.lastSix_limit[poolName] = 0;
            result.isHaveSix_limit[poolName] = false;

            for (let i = 0; i < poolChars.length; i++) {
                if (poolChars[i].rarity == 5) {
                    result.lastSix_limit[poolName] = i;
                    result.isHaveSix_limit[poolName] = true;
                    break;
                }
            }
            if (!result.isHaveSix_limit[poolName]) {
                result.lastSix_limit[poolName] += poolChars.length;
            }
        } else {
            // 非限定池
            if (!result.isHaveSix) {
                for (let i = 0; i < poolChars.length; i++) {
                    if (poolChars[i].rarity == 5) {
                        result.lastSix += i;
                        result.isHaveSix = true;
                        break;
                    }
                }
                result.lastSix += poolChars.length;
            }
        }
    }
    return result;
}

interface ExportData {
    lastSixData: AKStorageInterface["poolData"][string]["lastSixData"];
    starData: Result["counts"];
    currentLimitPool: string[];
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
                await drawTable.findByKeypathAndUpdate(poolName, { $set: { star: starData[poolName] } });
            }
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
        currentLimitPool: result.currentLimitPool,
    };
}
