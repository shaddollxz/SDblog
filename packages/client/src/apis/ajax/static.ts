import axios from "../axios";
import type { AxiosPromise } from "axios";
import type { UploadAvatarOption, UploadImageOption } from "@blog/server";

// 上传图片
export function uploadImage(formData: FormDataT<UploadImageOption>): AxiosPromise<{ imgSrc: string }> {
    return axios({
        method: "post",
        url: "static/image",
        data: formData,
    });
}

// 删除图片
export function removeImage(src: string) {
    return axios({
        method: "delete",
        url: "static/image",
        data: { src },
    });
}

// 上传头像
export function uploadAvatar(formData: FormDataT<UploadAvatarOption>): AxiosPromise<{ imgSrc: string }> {
    return axios({
        method: "post",
        url: "static/avatar",
        data: formData,
    });
}
