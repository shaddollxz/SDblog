import axios from "../axios";
import type { EssayInfo, EssayListOptions, ReplyItemInfo } from "@blog/server";

// 随笔列表
export function essayList(page: EssayListOptions["page"]) {
    return axios<{ essayList: EssayInfo[]; allPage: number }>({
        method: "get",
        url: "essay/essayList",
        params: {
            page,
        },
    });
}

// 随笔评论列表
export function essayReplyList(essayId: string) {
    return axios<ReplyItemInfo[]>({
        method: "get",
        url: "essay/replys/" + essayId,
    });
}

// 写随笔
export function writeEssay(content: string, page: string = "1") {
    return axios<{ essayList: EssayInfo[]; allPage: number }>({
        method: "post",
        url: "essay",
        data: { content },
        params: { page },
    });
}

// 删除随笔
export function deleteEssay(essayId: string, page: string = "1") {
    return axios<{ essayList: EssayInfo[]; allPage: number }>({
        method: "delete",
        url: "essay",
        data: { essayId },
        params: { page },
    });
}

// 随笔点赞
export function like(essayId: string) {
    return axios({
        method: "put",
        url: "essay/like",
        data: {
            essayId,
        },
    });
}
