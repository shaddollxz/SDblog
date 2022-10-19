import axios from "../axios";
import type { TagInfo, CreateTagOptions } from "@blog/server";

// 获得所有tag
export function getAllTag() {
    return axios<TagInfo[]>({
        method: "get",
        url: "tag",
    });
}

// 添加新tag
export function addNewTag(tagValue: CreateTagOptions["value"]) {
    return axios<TagInfo>({
        method: "post",
        url: "tag",
        data: {
            value: tagValue,
        },
    });
}
