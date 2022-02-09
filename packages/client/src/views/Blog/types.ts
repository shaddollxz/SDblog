import type { BlogDetailInfo } from "@blog/server";

export type UpdateMarkdownContent = (value: string) => void;

export type UpdateReplyCount = (value: number) => void;

export type MarkdownContent = Ref<string>;

export type ReplyCount = Ref<number>;

export type BlogDetail_Inject = Ref<BlogDetailInfo>;
