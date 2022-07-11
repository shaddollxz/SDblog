import { Pan, PanFile } from "../db";
import Folder from "../utils/Folder";
import { StatusEnum } from "#interface";
import type { CreateFolderOption, RemoveFolderOption } from "#interface";

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

export const uploadFile: PostHandler = async (req, res, next) => {
    try {
    } catch (e) {
        next(e);
    }
};

export const removeFile: DeleteHandler = async (req, res, next) => {
    try {
    } catch (e) {
        next(e);
    }
};

export const fileDetail: GetHandler = async (req, res, next) => {
    try {
    } catch (e) {
        next(e);
    }
};
