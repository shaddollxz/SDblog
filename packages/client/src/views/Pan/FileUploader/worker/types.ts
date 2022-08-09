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

interface BeginAnalyzeFile {
    step: "beginAnalyzeFile";
    name: string;
}
interface AnalyzeFileEnd {
    step: "analyzeFileEnd";
    name: string;
    chunks: number;
}
interface BeginUploadFile {
    step: "beginUploadFile";
    name: string;
}

interface Progress {
    step: "progress";
    name: string;
    already: number;
}

interface UploadEnd {
    step: "end";
    name: string;
    folderJson: string;
}

export type MainOnMessage =
    | UploadStart
    | UploadChunk
    | BeginAnalyzeFile
    | AnalyzeFileEnd
    | BeginUploadFile
    | Progress
    | UploadEnd
    | Err;

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
