import { Pan } from "../../db/pan";
import { PanFile } from "../../db/panfile";
import type { SchemaToInfo } from "../tools/SchemaToInfo";

export type PanInfo = SchemaToInfo<Pan>;
export type PanFileInfo = SchemaToInfo<PanFile>;

export type PanPath = `/${string}`;

export type Folder = {
    id: string;
    name: string;
    files?: PanFileInfo[];
    folders?: Folder[];
};

export interface PanListRes {
    folderJson: string;
}

export interface CreateFolderOption {
    name: string;
    path: PanPath;
}

export interface RemoveFolderOption {
    path: PanPath[];
}

export interface RenameFolderOption {
    name: string;
    path: PanPath;
}

export interface MoveFolderOption {
    from: PanPath;
    to: PanPath;
}

export interface UploadFileStartOption {
    hash: string;
    folderId: string;
    name: string;
    chunks: number;
}
export interface UploadFileStartRes {
    folderJson?: string;
    needChunk?: number[];
}

export type UploadFileChunkOption = {
    index: number;
    hash: string;
    file: Blob;
    fileName?: string;
};

export interface UploadFileEndOption {
    folderId: string;
    name: string;
    hash: string;
}

export interface RemoveFileOption {
    fileId: string;
}

export interface RenameFileOption {
    name: string;
    fileId: string;
}

export interface MoveFileOption {
    fileId: string;
    folderId: string;
}

export {};
