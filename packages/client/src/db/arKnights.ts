import { SDIDB } from "sdt3";
import type { SDIDBTable } from "sdt3";
import type { RecruitListItem } from "@blog/server";

export interface DrawTableType {
    poolName: string;
    operators: RecruitListItem["chars"];
    star: { 3: number; 4: number; 5: number; 6: number };
    ts: number;
}

let drawTable: SDIDBTable<DrawTableType, "operators">;
export async function useDrawTable() {
    if (drawTable) return drawTable;

    const db = await new SDIDB("arKnights");
    drawTable = await db.defineTable<DrawTableType, "operators">("draw", {
        keypath: "poolName",
        index: { operators: {} },
    });
    console.log(db.version);
    await db.open("arKnights");
    db.close();
    console.log(await drawTable.findAll());
    return drawTable;
}
