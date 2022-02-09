import type { Author } from "./public";
import { ReplyEnum } from "../enum";
import type { Reply, VisitorInfo as Visitor } from "../../db/reply";
import type { SchemaToInfo } from "../tools/SchemaToInfo";

// 博客和随笔的回复
export type ReplyItemInfo = Omit<SchemaToInfo<Reply>, "user" | "visitot"> & {
    author: Author;
    children: ReplyItemInfo[];
};

// 从接口返回的评论数据
export type ReplyListInfo = {
    replyList: ReplyItemInfo[];
    count: number;
};

// 游客信息
export type VisitorInfo = Visitor;

// 回复博客或随笔信息
export interface WriteReplyOptions {
    type: ReplyEnum;
    content: string;
    replyMainId: string;
    replyTo?: string;
    visitorInfo?: VisitorInfo;
}
export {};
