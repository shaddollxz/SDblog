import axios from "../axios";
import type { AxiosPromise } from "axios";
import type {
    PanListRes,
    CreateFolderOption,
    RemoveFolderOption,
    RenameFolderOption,
    UploadFileOption,
    UploadFileStartOption,
    UploadFileStartRes,
    UploadFileChunkOption,
    UploadFileEndOption,
    Success,
    Faild,
} from "@blog/server";

export function panFolder(): AxiosPromise<PanListRes> {
    return axios({
        method: "get",
        url: "/pan/folder",
    });
}

export function createPanFolder(data: CreateFolderOption): AxiosPromise<PanListRes> {
    return axios({
        method: "put",
        url: "/pan/folderf",
        data,
    });
}

export function removePanFolder(data: RemoveFolderOption): AxiosPromise<PanListRes> {
    return axios({
        method: "delete",
        url: "/pan/folderf",
        data,
    });
}

export function renamePanFolder(data: RenameFolderOption): AxiosPromise<PanListRes> {
    return axios({
        method: "post",
        url: "/pan/folderf",
        data,
    });
}

export function uploadPanFileStart(data: UploadFileStartOption): AxiosPromise<UploadFileStartRes> {
    return axios({
        method: "post",
        url: "",
        data,
    });
}

export function uploadPanFile(data: FormDataT<UploadFileOption>): AxiosPromise<PanListRes> {
    return axios({
        method: "post",
        url: "",
        data,
    });
}

export function uploadPanFileChunk(data: FormDataT<UploadFileChunkOption>): AxiosPromise<Success | Faild> {
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
