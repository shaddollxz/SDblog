import { SDIDB } from "sdt3";
import type { RecruitListItem } from "@blog/server";

export interface DrawTableType {
    poolName: string;
    operators: RecruitListItem["chars"];
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
