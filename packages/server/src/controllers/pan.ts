import fs from "fs-extra";
import type { Document } from "mongoose";
import path from "path";
import { PanDB, PanFileDB, TempFileDB } from "../db";
import { DownloadFileTypeEnum, StatusEnum } from "../typings/enum";
import type {
    CreateFolderOption,
    DownloadFileOption,
    EditDesciption,
    IsUploadEnd,
    MoveFileOption,
    MoveFolderOption,
    RemoveFileOption,
    RemoveFolderOption,
    RenameFileOption,
    RenameFolderOption,
    UploadFileChunkOption,
    UploadFileEndOption,
    UploadFileStartOption,
    ZipMultiOption,
} from "../typings/interface/pan";
import Folder from "../utils/Folder";
import { filenameMsg } from "../utils/formateFilename";
import { useConcatTempFilesWorker, useZipWorker } from "../workers";

// #region folder
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

        const panFiles = await PanFileDB.find({ belongId: folderDoc._id });
        for (const file of panFiles) {
            if (deleteIds.includes(file.folderId)) {
                await file.deleteFile(req.body._id!);
            }
        }

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
        const { from, to } = req.body;
        const folderDoc = (await PanDB.findById(req.body._id!))!;
        const folder = new Folder(folderDoc.path);
        folder.move(from, to);
        folderDoc.path = folder.json();
        await folderDoc.save();
        next();
    } catch (e) {
        next(e);
    }
};
// #endregion

// #region file
export const fileDetail: GetHandler<any, { fileId: string }> = async (req, res, next) => {
    try {
    } catch (e) {
        next(e);
    }
};

export const renameFile: PostHandler<RenameFileOption> = async (req, res, next) => {
    try {
        const { fileId, name } = req.body;
        await PanFileDB.findByIdAndUpdate(fileId, { $set: { name } });
        res.status(StatusEnum.OK).json({ success: true });
    } catch (e) {
        next(e);
    }
};

export const moveFile: PostHandler<MoveFileOption> = async (req, res, next) => {
    try {
        const { fileIds, folderId } = req.body;
        for (const fileId of fileIds) {
            await PanFileDB.findByIdAndUpdate(fileId, { $set: { folderId } });
        }
        next();
    } catch (e) {
        next(e);
    }
};

export const removeFile: DeleteHandler<RemoveFileOption> = async (req, res, next) => {
    try {
        const { _id, fileIds } = req.body;
        for (const fileId of fileIds) {
            const file = await PanFileDB.findOne({ hash: fileId, belongId: _id });
            await file?.deleteFile(_id!);
        }
        res.status(StatusEnum.OK).json({ success: true });
    } catch (e) {
        next(e);
    }
};

export const editDesciption: PostHandler<EditDesciption> = async (req, res, next) => {
    try {
        const { fileId, desciption } = req.body;
        await PanFileDB.findByIdAndUpdate(fileId, { $set: { desciption } });
        res.status(StatusEnum.OK).json({ success: true });
    } catch (e) {
        next(e);
    }
};

/** 从回收站回收文件 */
export const recoveryFile: PostHandler = async (req, res, next) => {
    try {
    } catch (e) {
        next(e);
    }
};

export const uploadStart: PostHandler<UploadFileStartOption> = async (req, res, next) => {
    try {
        const { hash, name, folderId, chunks, _id } = req.body;

        const panfile = (await PanFileDB.find({ hash }).limit(1))[0];
        if (panfile && (await ensureDBFile(path.resolve(process.env.PAN_PATH, panfile.hash), panfile))) {
            //* 文件已经存在
            const file = new PanFileDB({
                hash,
                belongId: _id,
                folderId,
                size: panfile.size,
                name,
            });
            await file.save();
            next();
        } else {
            const deletedFile = await TempFileDB.findOne({ hash, fileName: hash });
            if (deletedFile) {
                //* 回收站中有上传的文件

                return next();
            }
            const files = await TempFileDB.find({ hash });
            if (files.length == chunks) {
                //* 文件chunk已经全部凑齐
                return res.status(StatusEnum.OK).json({ needChunk: [] });
            } else {
                //* 缺少chunk 通知前端开始传输需要的
                const hasChunks: Record<number, boolean> = {};
                for (const file of files) {
                    hasChunks[+filenameMsg<TempChunkFileMsg>(file.fileName).chunkIndex] = true;
                }
                const needChunk: number[] = [];
                for (let i = 0; i < chunks; i++) {
                    if (!hasChunks[i]) {
                        needChunk.push(i);
                    }
                }
                return res.status(StatusEnum.OK).json({ needChunk });
            }
        }
    } catch (e) {
        next(e);
    }
};

export const uploadChunk: PutHandler<UploadFileChunkOption> = async (req, res, next) => {
    try {
        const { hash, fileName } = req.body;
        const tempFile = new TempFileDB({
            hash,
            fileName,
        });
        await tempFile.save();
        res.status(StatusEnum.OK).json({ success: true });
    } catch (e) {
        next(e);
    }
};

export const uploadEnd: PostHandler<UploadFileEndOption> = async (req, res, next) => {
    try {
        res.status(StatusEnum.NoResult).json({ success: true });
        const { _id, name, folderId, hash } = req.body;
        const files = await TempFileDB.find({ hash });
        try {
            const { hash: resultHash, size } = await useConcatTempFilesWorker(
                files.map((item) => item.fileName),
                hash
            );

            if (hash == resultHash) {
                const fileDetail = new PanFileDB({
                    hash: hash,
                    belongId: _id,
                    folderId,
                    size,
                    name,
                });
                await fileDetail.save();
            } else {
                console.error("原文件 " + hash + " 损坏" + "现hash为 " + resultHash);
                const fileDetail = new PanFileDB({
                    hash: hash,
                    folderId,
                    name,
                    size: 0,
                });
                await fileDetail.save();
            }

            TempFileDB.deleteMany({ hash }).then(() => console.log("数据库相关临时数据清除结束 " + hash));
        } catch (e) {
            console.error(e);
            const fileDetail = new PanFileDB({
                hash: hash,
                folderId,
                name,
                size: 0,
            });
            await fileDetail.save();
        }
    } catch (e) {
        next(e);
    }
};

export const isUploadEnd: GetHandler<IsUploadEnd> = async (req, res, next) => {
    try {
        const file = await PanFileDB.findOne({ hash: req.query.hash });
        if (file) {
            if (file.belongId) {
                next();
            } else {
                await file.delete();
                res.status(StatusEnum.ParameterNotAllow).json({
                    error: "文件传输时损坏，上传失败",
                    isShow: true,
                });
            }
        } else {
            res.status(StatusEnum.OK).json({ success: false });
        }
    } catch (e) {
        next(e);
    }
};

export const zipMulti: PostHandler<ZipMultiOption> = async (req, res, next) => {
    try {
        const { _id, folderPaths, files, zipId } = req.body;
        const doc = await TempFileDB.findOne({ name: zipId });
        if (doc && (await ensureDBFile(path.resolve(process.env.TEMP_PATH, doc.hash), doc))) {
            return res.status(StatusEnum.NoResult).json({ success: true });
        } else {
            res.status(StatusEnum.NoResult).json({ success: true });
            const folderDoc = await PanDB.findFolderWithFile(_id!);
            const { hash } = await useZipWorker({
                folder: folderDoc.folderObj,
                folderPaths,
                files,
            });
            new TempFileDB({
                hash,
                fileName: hash,
                name: zipId,
                user: _id,
            }).save();
        }
    } catch (e) {
        next(e);
    }
};

export const isZipEnd: GetHandler<{ zipId: string }> = async (req, res, next) => {
    try {
        const { zipId } = req.query;
        const doc = await TempFileDB.findOne({ name: zipId });
        if (doc) {
            res.status(StatusEnum.OK).json({ hash: doc.hash });
        } else {
            res.status(StatusEnum.OK).json({ success: false });
        }
    } catch (e) {
        next(e);
    }
};

export const downloadFile: GetHandler<DownloadFileOption> = async (req, res, next) => {
    try {
        const { hash, type } = req.query;
        const target = path.resolve(
            type == DownloadFileTypeEnum.file ? process.env.PAN_PATH : process.env.TEMP_PATH,
            hash
        );

        if (await fs.pathExists(target)) {
            res.status(StatusEnum.OK).sendFile(target);
        } else {
            res.status(StatusEnum.NotFound).json({ msg: "文件已丢失" });
        }
    } catch (e) {
        console.log(e);
        res.status(StatusEnum.NotFound).send(" ");
    }
};
// #endregion

async function ensureDBFile(filePath: string, doc: Document<any>) {
    if (!(await fs.pathExists(filePath))) {
        await doc.delete();
        return false;
    }
    return true;
}
