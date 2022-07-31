interface Err {
    step: "error";
    msg: string;
}

interface UploadStart {
    step: "uploadStart";
    folderId: string;
    fileName: string;
    hash: string;
    chunks: number;
}

interface UploadChunk {
    step: "uploadChunk";
    folderId: string;
    fileName: string;
    hash: string;
    buffers: (ArrayBuffer | null)[];
}

interface Progress {
    step: "progress";
    all: number;
    already: number;
}

interface UploadEnd {
    step: "end";
    folderJson: string;
}

export type MainOnMessage = UploadStart | UploadChunk | Progress | UploadEnd | Err;

interface SplitBuffer {
    step: "splitBuffer";
    folderId: string;
    fileBuffers: ArrayBuffer[];
    fileNames: string[];
}

interface UploadChunks {
    step: "uploadChunks";
    hash: string;
    needChunks: number[];
}

interface UploadOneChunkEnd {
    step: "uploadOneChunkEnd";
    hash: string;
}

interface UploadFileEnd {
    step: "uploadEnd";
    folderJson: string;
    hash: string;
}

interface UploadChunkError {
    step: "uploadError";
    notUploaded: number[];
}

export type MainPostMessage =
    | SplitBuffer
    | UploadChunks
    | UploadOneChunkEnd
    | UploadFileEnd
    | UploadChunkError;
