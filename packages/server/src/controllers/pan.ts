import { Pan, PanFile, TempFile } from "../db";
import Folder from "../utils/Folder";
import { originalFilename, filenameMsg, formateFilename } from "../utils/formateFilename";
import fs from "fs-extra";
import path from "path";
import { StatusEnum } from "#interface";
import type {
    CreateFolderOption,
    RemoveFolderOption,
    RenameFolderOption,
    MoveFolderOption,
    UploadFileChunkOption,
    UploadFileEndOption,
    UploadFileStartOption,
    RemoveFileOption,
    RenameFileOption,
    MoveFileOption,
} from "#interface";

//* folder

export const folderList: GetHandler = async (req, res, next) => {
    try {
        const { folderObj } = await Pan.findFolderWithFile(req.body._id!);
        res.status(StatusEnum.OK).json({ folderJson: folderObj });
    } catch (e) {
        next(e);
    }
};

export const createFolder: PutHandler<CreateFolderOption> = async (req, res, next) => {
    try {
        const _id = req.body._id!;
        const folderDoc = (await Pan.findById(_id))!;
        const folder = new Folder(folderDoc.path);
        folder.create(req.body.path, req.body.name);
        folderDoc.path = folder.json();
        await folderDoc.save();
        next();
    } catch (e) {
        next(e);
    }
};

export const removeFolder: DeleteHandler<RemoveFolderOption> = async (req, res, next) => {
    try {
        const folderDoc = (await Pan.findById(req.body._id!))!;

        const folder = new Folder(folderDoc.path);
        const { folderIds: deleteIds, errors } = folder.remove(req.body.path);
        folderDoc.path = folder.json();

        await folderDoc.save();
        setTimeout(async () => {
            const panFiles = await PanFile.find({ belongId: folderDoc._id });
            for (const file of panFiles) {
                if (deleteIds.includes(file.folderId)) {
                    file.deleteFile();
                }
            }
        }, 0);

        if (errors.length) {
            next(errors.reduce((pre, cur) => pre + "\r" + cur, "以下文件路径没有找到："));
        } else {
            next();
        }
    } catch (e) {
        next(e);
    }
};

export const renameFolder: PostHandler<RenameFolderOption> = async (req, res, next) => {
    try {
        const folderDoc = (await Pan.findById(req.body._id!))!;
        const folder = new Folder(folderDoc.path);
        folder.rename(req.body.path, req.body.name);
        folderDoc.path = folder.json();
        await folderDoc.save();
        next();
    } catch (e) {
        next(e);
    }
};

export const moveFolder: PostHandler<MoveFolderOption> = async (req, res, next) => {
    try {
    } catch (e) {
        next(e);
    }
};

//* file

export const uploadFile: PutHandler = async (req, res, next) => {
    try {
    } catch (e) {
        next(e);
    }
};

export const renameFile: PostHandler<RenameFileOption> = async (req, res, next) => {
    try {
    } catch (e) {
        next(e);
    }
};

export const moveFile: PostHandler<MoveFileOption> = async (req, res, next) => {
    try {
    } catch (e) {
        next(e);
    }
};

export const uploadStart: PostHandler<UploadFileStartOption> = async (req, res, next) => {
    try {
        const { hash, name, folderId, chunks, _id } = req.body;

        const panfile = (await PanFile.find({ hash }).limit(1))[0];
        if (panfile) {
            //todo 文件已经存在
            const file = new PanFile({
                belongId: _id,
                folderId,
                filePath: panfile.filePath,
                size: panfile.size,
                name,
                hash,
            });
            await file.save();
            next();
        } else {
            const files = await TempFile.find({ hash });
            if (files.length == chunks) {
                //todo 文件chunk已经全部凑齐

                next();
            } else {
                //todo 缺少chunk 通知前端开始传输需要的
                const hasChunks: Record<number, boolean> = {};
                for (const file of files) {
                    hasChunks[+filenameMsg(path.basename(file.filePath)).chunkIndex] = true;
                }
                const needChunk: number[] = [];
                for (let i = 0; i < chunks; i++) {
                    if (!hasChunks[i]) {
                        needChunk.push(i);
                    }
                }

                res.status(StatusEnum.OK).json({ needChunk });
                return;
            }
        }
    } catch (e) {
        next(e);
    }
};

export const uploadChunk: PutHandler<UploadFileChunkOption> = async (req, res, next) => {
    try {
    } catch (e) {
        next(e);
    }
};

export const uploadEnd: PostHandler<UploadFileEndOption> = async (req, res, next) => {
    try {
        const { _id, name, folderId, hash } = req.body;
    } catch (e) {
        next(e);
    }
};

export const removeFile: DeleteHandler<RemoveFileOption> = async (req, res, next) => {
    try {
    } catch (e) {
        next(e);
    }
};

export const fileDetail: GetHandler<any, { fileId: string }> = async (req, res, next) => {
    try {
    } catch (e) {
        next(e);
    }
};
