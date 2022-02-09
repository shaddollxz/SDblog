import type { TagInfo } from "./tag";
import type { Author } from "./public";
import type { Blog } from "../../db/blog";
import type { SchemaToInfo } from "../tools/SchemaToInfo";

// 博客详情
export type BlogDetailInfo = Omit<SchemaToInfo<Blog>, "author"> & { author: Author };

// 发送博客需要的信息
export type WriteBlogOptions = {
    blogMsg: Pick<BlogDetailInfo, "content" | "title" | "tags" | "description" | "headPic">;
};

// 博客列表
export type BlogListItemInfo = Omit<BlogDetailInfo, "content"> & {
    contentLength: number;
};

// 时间线信息
export interface TimeLineItemInfo {
    _id: string;
    createdAt: number;
    title: string;
}

// 主页
export interface HomePageOptions {
    page?: number | NumberString;
}

// 查找博客
export interface SearchBlogByTagOptions {
    tag: string;
    page: number | NumberString;
}
export interface SearchBlogByKeywordOptions {
    keyword: string;
    page: number | NumberString;
}

export {};
