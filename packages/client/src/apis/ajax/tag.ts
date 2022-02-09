import axios from "../axios";
import type { AxiosPromise } from "axios";
import type { TagInfo, CreateTagOptions } from "@blog/server";

// 获得所有tag
export function getAllTag(): AxiosPromise<TagInfo[]> {
    return axios({
        method: "get",
        url: "tag",
    });
}

// 添加新tag
export function addNewTag(tagValue: CreateTagOptions["value"]): AxiosPromise<TagInfo> {
    return axios({
        method: "post",
        url: "tag",
        data: {
            value: tagValue,
        },
    });
}
