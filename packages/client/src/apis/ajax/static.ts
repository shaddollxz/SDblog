import axios from "../axios";
import type { AxiosPromise } from "axios";

// 上传图片
export function uploadImage(formData: FormData): AxiosPromise<{ imgSrc: string }> {
    return axios({
        method: "post",
        url: "uploadImg",
        data: formData,
    });
}

// 上传头像
export function uploadAvatar(formData: FormData): AxiosPromise<{ imgSrc: string }> {
    return axios({
        method: "post",
        url: "uploadAvatar",
        data: formData,
    });
}

/**
 *  @deprecated 随机图片 该接口已经废弃
 */
export function randomPic(): AxiosPromise<{ imgSrc: string }> {
    return axios({
        method: "get",
        url: "randomPic",
    });
}
