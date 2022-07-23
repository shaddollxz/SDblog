import fs from "fs-extra";
import path from "path";
import { PanDB, PanFileDB, TempFileDB } from "../db";
import { StatusEnum } from "../typings/enum";
import type {
    CreateFolderOption,
    MoveFileOption,
    MoveFolderOption,
    RemoveFileOption,
    RemoveFolderOption,
    RenameFileOption,
    RenameFolderOption,
    UploadFileChunkOption,
    UploadFileEndOption,
    UploadFileStartOption,
} from "../typings/interface/pan";
import Folder from "../utils/Folder";
import { filenameMsg, filenameSlice, formateFilename } from "../utils/formateFilename";
import { useConcatFilesWorker } from "../workers";

//* folder

export const folderList: GetHandler = async (req, res, next) => {
    try {
        const { folderObj } = await PanDB.findFolderWithFile(req.body._id!);
        res.status(StatusEnum.OK).json({ folderJson: folderObj });
    } catch (e) {
        next(e);
    }
};

export const createFolder: PutHandler<CreateFolderOption> = async (req, res, next) => {
    try {
        const _id = req.body._id!;
        const folderDoc = (await PanDB.findById(_id))!;
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
        const folderDoc = (await PanDB.findById(req.body._id!))!;

        const folder = new Folder(folderDoc.path);
        const { folderIds: deleteIds, errors } = folder.remove(req.body.path);
        folderDoc.path = folder.json();

        await folderDoc.save();
        setTimeout(async () => {
            const panFiles = await PanFileDB.find({ belongId: folderDoc._id });
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
        const folderDoc = (await PanDB.findById(req.body._id!))!;
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

        const panfile = (await PanFileDB.find({ hash }).limit(1))[0];
        if (panfile) {
            //todo 文件已经存在
            const file = new PanFileDB({
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
            const files = await TempFileDB.find({ hash });
            if (files.length == chunks) {
                //todo 文件chunk已经全部凑齐
                try {
                    const path = await useConcatFilesWorker(files.map((file) => file.filePath));
                    const fileDetail = new PanFileDB({
                        belongId: _id,
                        folderId,
                        filePath: path,
                        size: (await fs.stat(path)).size,
                        name,
                        hash,
                    });
                    await fileDetail.save();
                    next();
                } catch (e) {
                    console.error(e);
                    res.status(StatusEnum.ServerError).json({
                        isShow: true,
                        error: "服务器错误，请稍后重试",
                    });
                }
            } else {
                //todo 缺少chunk 通知前端开始传输需要的
                const hasChunks: Record<number, boolean> = {};
                for (const file of files) {
                    hasChunks[+filenameMsg<TempChunkFileMsg>(path.basename(file.filePath)).chunkIndex] = true;
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
        const { hash, index, name, all } = req.body;
        const filePath = path.resolve(
            process.env.TEMP_PATH,
            formateFilename(hash + filenameSlice(name).suffix, { chunkIndex: index })
        );
        const tempFile = new TempFileDB({
            hash,
            filePath,
        });
        await tempFile.save();
        res.status(StatusEnum.OK).json({ success: true });
    } catch (e) {
        next(e);
    }
};

export const uploadEnd: PostHandler<UploadFileEndOption> = async (req, res, next) => {
    try {
        const { _id, name, folderId, hash } = req.body;
        const files = await TempFileDB.find({ hash });
        try {
            const path = await useConcatFilesWorker(files.map((file) => file.filePath));
            const fileDetail = new PanFileDB({
                belongId: _id,
                folderId,
                filePath: path,
                size: (await fs.stat(path)).size,
                name,
                hash,
            });
            await fileDetail.save();
            next();
        } catch (e) {
            console.error(e);
            res.status(StatusEnum.ServerError).json({
                isShow: true,
                error: "服务器错误，请稍后重试",
            });
        }
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
