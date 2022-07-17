import axios from "../axios";
import type { AxiosPromise } from "axios";
import type {
    PanListRes,
    UploadFileStartOption,
    UploadFileStartRes,
    UploadFileChunkOption,
    UploadFileEndOption,
    Success,
    Faild,
} from "#interface";

export function uploadPanFileStart(data: UploadFileStartOption): AxiosPromise<UploadFileStartRes> {
    return axios({
        method: "post",
        url: "",
        data,
    });
}

export function uploadPanFile(data: FormData): AxiosPromise<PanListRes> {
    return axios({
        method: "post",
        url: "",
        data,
    });
}

export function uploadPanFileChunk(data: UploadFileChunkOption): AxiosPromise<Success | Faild> {
    return axios({
        method: "post",
        url: "",
        data,
    });
}

export function uploadPanFileEnd(data: UploadFileEndOption): AxiosPromise<PanListRes> {
    return axios({
        method: "post",
        url: "",
        data,
    });
}
