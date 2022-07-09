import { Pan } from "../../db/pan";
import { PanFile } from "../../db/panfile";
import { SchemaToInfo } from "../tools/SchemaToInfo";

export type PanInfo = SchemaToInfo<Pan>;
export type PanFileInfo = SchemaToInfo<PanFile>;

export interface PanListRes {
    folderJson: string;
}

export interface CreateFolderOption {
    name: string;
    path: string;
}

export interface RemoveFolderOption {
    path: string;
}

export interface UploadFileOption {
    name: string;
    path: string;
}

export interface RemoveFileOption {
    path: string;
}
