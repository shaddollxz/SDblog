import { Pan } from "../../db/pan";
import { PanFile } from "../../db/panfile";
import { SchemaToInfo } from "../tools/SchemaToInfo";

export type PanInfo = SchemaToInfo<Pan>;
export type PanFileInfo = SchemaToInfo<PanFile>;

export type PanPath = `/${string}`;

export interface FolderJson {
    files?: { size: number; filePath: string }[];
}

export interface PanListRes {
    folderJson: string;
}

export interface CreateFolderOption {
    name: string;
    path: PanPath;
}

export interface RemoveFolderOption {
    path: PanPath;
}

export interface UploadFileOption {
    name: string;
    path: PanPath;
}

export interface RemoveFileOption {
    path: PanPath;
}
