import { Pan, PanFile } from "../db";
import { StatusEnum } from "#interface";
import type { CreateFolderOption, RemoveFolderOption } from "#interface";

export const folderList: GetHandler = async (req, res, next) => {
    try {
        const { folderObj } = await Pan.findFolderWithFile(req.body._id!);
        res.status(StatusEnum.OK).json({ folderJson: JSON.stringify(folderObj) });
    } catch (e) {
        next(e);
    }
};

export const createFolder: PutHandler<CreateFolderOption> = async (req, res, next) => {
    try {
        const _id = req.body._id!;
        const folderDoc = (await Pan.find({ user: _id }))[0];
        const folderObj = JSON.parse(folderDoc.path);
        const targetArr = req.body.path.split("/");
        targetArr[0] == "" && targetArr.shift();

        if (req.body.path != "/") {
            targetArr.reduce((pre, cur) => pre[cur], folderObj)[req.body.name] = {};
        } else {
            folderObj[req.body.name] = {};
        }

        folderDoc.path = JSON.stringify(folderObj);
        await folderDoc.save();
        next();
    } catch (e) {
        next(e);
    }
};

export const removeFolder: DeleteHandler<RemoveFolderOption> = async (req, res, next) => {
    try {
        const folderDoc = await Pan.findByUser(req.body._id!);
        const folderObj = JSON.parse(folderDoc.path);
        const targetArr = req.body.path.split("/");
        targetArr[0] == "" && targetArr.shift();
        const lastKey = targetArr.at(-1)!;

        const lastObj = targetArr.reduce(
            (pre, cur, index) => (index == targetArr.length - 1 ? pre : pre[cur]),
            folderObj
        );
        delete lastObj[lastKey];

        folderDoc.path = JSON.stringify(folderObj);
        await folderDoc.save();

        const panFiles = await PanFile.find({ belongId: folderDoc._id });
        for (const file of panFiles) {
            if (file.path.startsWith(req.body.path)) {
                await file.deleteFile();
            }
        }

        next();
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
