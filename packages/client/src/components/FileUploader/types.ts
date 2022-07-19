import type { LocalFiles } from "sdt3";

export interface MainOnMessage {
    error?: "read" | "upload";

    finish?: boolean;
    finishOrder?: number;
    folderJson?: string;

    progress?: number;
}

export interface MainPostMessage {
    folderId: string;
    name: string;
    files: LocalFiles;

    isSendProgress: boolean;
}
