import type { LocalFiles } from "sdt3";
import type { PanPath } from "#interface";

export interface MainOnMessage {
    error?: "read" | "upload";

    finish?: boolean;
    progress?: number;
    finishOrder?: number;
}

export interface MainPostMessage {
    path: PanPath;
    name: string;
    isSendProgress: boolean;
    files: LocalFiles;
}
