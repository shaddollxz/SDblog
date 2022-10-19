import axios from "../axios";
import { isEmpty } from "sdt3";
import type { ReplyListInfo, WriteReplyOptions } from "@blog/server";

// 发送回复
export function writeReply(datas: WriteReplyOptions) {
    if (isEmpty(datas.visitorInfo)) {
        return axios<ReplyListInfo>({
            method: "post",
            url: "reply/user",
            data: datas,
        });
    } else {
        return axios<ReplyListInfo>({
            method: "post",
            url: "reply/visitor",
            data: datas,
        });
    }
}

// 回复列表
export function replyList(replyMainId: string) {
    return axios<ReplyListInfo>({
        method: "get",
        url: "reply/replyList/" + replyMainId,
    });
}

// 回复点赞
export function likeReply(replyId: string) {
    return axios({
        method: "put",
        url: "reply/" + replyId,
    });
}
