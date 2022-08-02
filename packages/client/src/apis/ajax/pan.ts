import axios from "../axios";
import type { AxiosPromise } from "axios";
import type {
    PanListRes,
    CreateFolderOption,
    RemoveFolderOption,
    MoveFolderOption,
    RenameFolderOption,
    MoveFileOption,
    RemoveFileOption,
    RenameFileOption,
    UploadFileStartOption,
    UploadFileStartRes,
    UploadFileChunkOption,
    UploadFileEndOption,
    IsUploadEnd,
    Success,
    Faild,
} from "@blog/server";
import Token from "@/storages/token";

// #region folder
export function panFolder(): AxiosPromise<PanListRes> {
    return axios({
        method: "get",
        url: "/pan/folder",
    });
}

export function createPanFolder(data: CreateFolderOption): AxiosPromise<PanListRes> {
    return axios({
        method: "put",
        url: "/pan/folder",
        data,
    });
}

export function removePanFolder(data: RemoveFolderOption): AxiosPromise<PanListRes> {
    return axios({
        method: "delete",
        url: "/pan/folder",
        data,
    });
}

export function movePanFolder(data: MoveFolderOption): AxiosPromise<PanListRes> {
    return axios({
        method: "post",
        url: "/pan/folder/move",
        data,
    });
}

export function renamePanFolder(data: RenameFolderOption): AxiosPromise<PanListRes> {
    return axios({
        method: "post",
        url: "/pan/folder",
        data,
    });
}
// #endregion

// #region file
export function removePanFile(data: RemoveFileOption): AxiosPromise<PanListRes> {
    return axios({
        method: "delete",
        url: "/pan/file",
        data,
    });
}

export function renamePanFile(data: RenameFileOption): AxiosPromise<Success | Faild> {
    return axios({
        method: "post",
        url: "/pan/file/rename",
        data,
    });
}

export function movePanFile(data: MoveFileOption): AxiosPromise<PanListRes> {
    return axios({
        method: "post",
        url: "/pan/file/move",
        data,
    });
}

export function uploadPanFileStart(data: UploadFileStartOption): AxiosPromise<UploadFileStartRes> {
    return axios({
        method: "post",
        url: "/pan/file/start",
        data,
    });
}

export function uploadPanFileChunk(data: FormDataT<UploadFileChunkOption>): AxiosPromise<Success | Faild> {
    return axios({
        method: "put",
        url: "/pan/file/chunk",
        data,
    });
}

export function uploadPanFileEnd(data: UploadFileEndOption) {
    return axios({
        method: "post",
        url: "/pan/file/end",
        data,
    });
}

export function isUploadEnd(data: IsUploadEnd): AxiosPromise<PanListRes> {
    return axios({
        method: "get",
        url: "/pan/file/end",
        params: data,
    });
}

// 使用axios浏览器会在全部接收后才开启下载 内存占用较大 fetch会在收到响应时马上开始
export function downloadFile(hash: string) {
    return fetch(`/api/pan/file/download?hash=${hash}`, {
        method: "get",
        headers: {
            Authorization: Token.get()!,
        },
    });
}
// #endregion
