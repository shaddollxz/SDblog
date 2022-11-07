import axios from "../axios";
import type {
    PanListRes,
    CreateFolderOption,
    RemoveFolderOption,
    MoveFolderOption,
    RenameFolderOption,
    MoveFileOption,
    RemoveFileOption,
    RenameFileOption,
    EditDesciption,
    UploadFileStartOption,
    UploadFileStartRes,
    UploadFileChunkOption,
    UploadFileEndOption,
    IsUploadEnd,
    ZipMultiOption,
    ZipMultiRes,
    DownloadFileOption,
    DownloadFileRes,
} from "@blog/server";
import Token from "@/storages/token";

// #region folder
export function panFolder() {
    return axios<PanListRes>({
        method: "get",
        url: "pan/folder",
    });
}

export function createPanFolder(data: CreateFolderOption) {
    return axios<PanListRes>({
        method: "post",
        url: "pan/folder",
        data,
    });
}

export function removePanFolder(data: RemoveFolderOption) {
    return axios<PanListRes>({
        method: "delete",
        url: "pan/folder",
        data,
    });
}

export function movePanFolder(data: MoveFolderOption) {
    return axios<PanListRes>({
        method: "put",
        url: "pan/folder/move",
        data,
    });
}

export function renamePanFolder(data: RenameFolderOption) {
    return axios<PanListRes>({
        method: "put",
        url: "pan/folder",
        data,
    });
}
// #endregion

// #region file
export function removePanFile(data: RemoveFileOption) {
    return axios<PanListRes>({
        method: "delete",
        url: "pan/file",
        data,
    });
}

export function renamePanFile(data: RenameFileOption) {
    return axios({
        method: "put",
        url: "pan/file/name",
        data,
    });
}

export function editDesciption(data: EditDesciption) {
    return axios({
        method: "put",
        url: "pan/file/desc",
        data,
    });
}

export function movePanFile(data: MoveFileOption) {
    return axios<PanListRes>({
        method: "put",
        url: "pan/file/move",
        data,
    });
}

export function uploadPanFileStart(data: UploadFileStartOption) {
    return axios<UploadFileStartRes>({
        method: "post",
        url: "pan/file/start",
        data,
    });
}

export function uploadPanFileChunk(data: FormDataT<UploadFileChunkOption>) {
    return axios({
        method: "post",
        url: "pan/file/chunk",
        data,
    });
}

export function uploadPanFileEnd(data: UploadFileEndOption) {
    return axios({
        method: "post",
        url: "pan/file/end",
        data,
    });
}

export function isUploadEnd(data: IsUploadEnd) {
    return axios<PanListRes>({
        method: "get",
        url: "pan/file/end",
        params: { ...data, date: Date.now() },
    });
}

export function zipMulti(data: ZipMultiOption) {
    return axios<ZipMultiRes>({
        method: "post",
        url: "pan/folder/zip",
        data,
    });
}

export function isZipEnd(zipId: string) {
    return axios<{ hash: string }>({
        method: "get",
        url: "pan/folder/zip",
        params: { zipId },
    });
}

// 使用axios浏览器会在全部接收后才开启下载 内存占用较大 fetch会在收到响应时马上开始
export function downloadFile(data: DownloadFileOption) {
    return axios<DownloadFileRes>({
        method: "get",
        url: "pan/file/download",
        params: data,
    });
}
// #endregion
