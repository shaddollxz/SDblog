import axios from "../axios";
import type { AxiosPromise } from "axios";
import { isEmpty } from "sdt3";
import type { ReplyItemInfo, ReplyListInfo, WriteReplyOptions, Success, Faild } from "@blog/server";

// 发送回复
export function writeReply(datas: WriteReplyOptions): AxiosPromise<ReplyListInfo> {
    if (isEmpty(datas.visitorInfo)) {
        return axios({
            method: "post",
            url: "reply/user",
            data: datas,
        });
    } else {
        return axios({
            method: "post",
            url: "reply/visitor",
            data: datas,
        });
    }
}

// 回复列表
export function replyList(replyMainId: string): AxiosPromise<ReplyListInfo> {
    return axios({
        method: "get",
        url: "reply/replyList/" + replyMainId,
    });
}

// 回复点赞
export function likeReply(replyId: string): AxiosPromise<Success | Faild> {
    return axios({
        method: "put",
        url: "reply/" + replyId,
    });
}
