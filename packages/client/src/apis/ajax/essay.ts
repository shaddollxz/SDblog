import axios from "../axios";
import type { AxiosPromise } from "axios";
import type { EssayInfo, EssayListOptions, ReplyItemInfo, Success, Faild } from "@blog/server";

// 随笔列表
export function essayList(
    page: EssayListOptions["page"]
): AxiosPromise<{ essayList: EssayInfo[]; allPage: number }> {
    return axios({
        method: "get",
        url: "essay/essayList",
        params: {
            page,
        },
    });
}

// 随笔评论列表
export function essayReplyList(essayId: string): AxiosPromise<ReplyItemInfo[]> {
    return axios({
        method: "get",
        url: "essay/replys/" + essayId,
    });
}

// 写随笔
export function writeEssay(content: string): AxiosPromise<{ essayList: EssayInfo[]; allPage: number }> {
    return axios({
        method: "post",
        url: "essay",
        data: {
            content,
        },
    });
}

// 删除随笔
export function deleteEssay(essayId: string): AxiosPromise<{ essayList: EssayInfo[]; allPage: number }> {
    return axios({
        method: "delete",
        url: "essay",
        data: {
            essayId,
        },
    });
}

// 随笔点赞
export function like(essayId: string): AxiosPromise<Success | Faild> {
    return axios({
        method: "put",
        url: "essay/like",
        data: {
            essayId,
        },
    });
}
