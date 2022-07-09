import { Pan, PanFile } from "../db";
import { StatusEnum } from "#interface";
import type { CreateFolderOption, RemoveFolderOption } from "#interface";

export const folderList: GetHandler = async (req, res, next) => {
    try {
        const folderJson = await Pan.findFolderWithFile(req.body._id!);
        res.status(StatusEnum.OK).json({ folderJson });
    } catch (e) {
        next(e);
    }
};

export const createFolder: PostHandler<CreateFolderOption> = async (req, res, next) => {
    try {
        const _id = req.body._id!;
        const folderObj = JSON.parse(await Pan.findFolderWithFile(_id));
        const targetArr = req.body.path.split("/");
        targetArr[0] == "" && targetArr.shift();

        targetArr.reduce((pre, cur) => pre[cur], folderObj)[req.body.name] = {};

        const newList = JSON.stringify(folderObj);
        await Pan.findOneAndUpdate({ user: _id }, { $set: { path: newList } });

        res.status(StatusEnum.OK).json({ folderJson: newList });
    } catch (e) {
        next(e);
    }
};

export const removeFolder: DeleteHandler<RemoveFolderOption> = async (req, res, next) => {
    try {
        const _id = req.body._id!;
        const folderObj = JSON.parse(await Pan.findFolderWithFile(_id));
        const targetArr = req.body.path.split("/");
        targetArr[0] == "" && targetArr.shift();
        const lastValue = targetArr.at(-1)!;

        const lastObj = targetArr.reduce(
            (pre, cur, index) => (index == targetArr.length - 2 ? pre : pre[cur]),
            folderObj
        );
        delete lastObj[lastValue];

        const newList = JSON.stringify(folderObj);
        await Pan.findOneAndUpdate({ user: _id }, { $set: { path: newList } });
        res.status(StatusEnum.OK).json({ folderJson: newList });
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
