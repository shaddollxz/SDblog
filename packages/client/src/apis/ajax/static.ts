import axios from "../axios";
import type { AxiosPromise } from "axios";

// 上传图片
export function uploadImage(formData: FormDataT<{ image: Blob }>): AxiosPromise<{ imgSrc: string }> {
    return axios({
        method: "post",
        url: "image",
        data: formData,
    });
}

// 删除图片
export function removeImage(src: string) {
    return axios({
        method: "delete",
        url: "image",
        data: { src },
    });
}

// 上传头像
export function uploadAvatar(formData: FormDataT<{ avatar: Blob }>): AxiosPromise<{ imgSrc: string }> {
    return axios({
        method: "post",
        url: "avatar",
        data: formData,
    });
}
