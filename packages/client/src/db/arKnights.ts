import { SDIDB, SDDate } from "sdt3";
import type { RecruitListItem } from "@blog/server";

export interface DrawTableType {
    poolName: string;
    operators: (RecruitListItem["chars"][number] | number)[]; // 每抽的ts隔开角色
    star: { 3: number; 4: number; 5: number; 6: number };
    ts: number;
}

export async function useDrawTable(flag: string) {
    const db = await new SDIDB("arKnights");

    return await db.defineTable<DrawTableType, "operators">(flag, {
        keypath: "poolName",
        index: { operators: {} },
    });
}

export function isCharData(
    data: DrawTableType["operators"][number]
): data is RecruitListItem["chars"][number] {
    return typeof data != "number";
}

export function operatorsWithTime(operators: DrawTableType["operators"]) {
    const drawDataWithTime: Record<string, RecruitListItem["chars"]> = {};
    for (const char of operators) {
        let time = "";
        if (isCharData(char)) {
            drawDataWithTime[time].push(char);
        } else {
            time = new SDDate(char * 1000).format("/YYYY/-/MM/-/DD/ /HH/:/mm/:/ss/");
            drawDataWithTime[time] = [];
        }
    }
    return drawDataWithTime;
}
