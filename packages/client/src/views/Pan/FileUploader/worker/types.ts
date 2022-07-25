import type { LocalFiles } from "sdt3";

export interface MainOnMessage {
    step: "slice" | "upload" | "end";

    error?: "slice" | "upload";

    sliceUploadData?: {
        order: number;
    };
    endData?: {
        folderJson: string;
    };

    progress?: number;
}

export interface MainPostMessage {
    folderId: string;
    files: LocalFiles;

    isSendProgress: boolean;
}
