import type { Author } from "./public";
import type { Essay } from "../../db/essay";
import type { SchemaToInfo } from "../tools/SchemaToInfo";

// 随笔信息
export type EssayInfo = Omit<SchemaToInfo<Essay>, "author"> & { author: Author };

// 获取随笔列表
export interface EssayListOptions {
    page?: number;
    pageCount?: number;
}

// 写随笔
export interface WriteEssayOptions {
    content: EssayInfo["content"];
    pictures?: EssayInfo["pictures"];
}

// 删除随笔
export interface RemoveEssayOptions {
    essayId: string;
}

// 随笔点赞
export interface LikeEssayOptions {
    essayId: string;
}

export {};
