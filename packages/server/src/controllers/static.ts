import { StatusEnum } from "#interface";
import { resolve } from "path";
import fs from "fs-extra";
import { fileHash } from "../utils/fileHash";
import { filenameSlice } from "../utils/formateFilename";

export const uploadImage: PostHandler = async (req, res, next) => {
    try {
        const file = req.file;
        if (file) {
            const hash = await fileHash(file.path);
            const newName = hash + filenameSlice(file.filename).suffix;
            if (!(await fs.pathExists(resolve(file.destination, newName)))) {
                await fs.rename(file.path, resolve(file.destination, newName));
            }
            res.status(StatusEnum.OK).json({
                imgSrc: process.env.PUBLIC_STATIC_PREFIX + "/image/" + newName,
            });
        }
    } catch (e) {
        next(e);
    }
};

export const removeImage: DeleteHandler<{ src: string }> = async (req, res, next) => {
    try {
        const regexp = new RegExp(`(?<=^${process.env.PUBLIC_STATIC_PREFIX}/).+`);
        const dir = req.body.src.match(regexp)?.[0];
        if (dir) {
            await fs.remove(resolve(process.env.PUBLIC_STATIC_PATH, dir));
        }
        res.status(StatusEnum.OK).json(null);
    } catch (e) {
        next(e);
    }
};

export const uploadAvatar: PostHandler = async (req, res, next) => {
    try {
        const file = req.file;
        if (file) {
            res.status(StatusEnum.OK).json({
                imgSrc: process.env.PUBLIC_STATIC_PREFIX + "/avatar/" + file.filename,
            });
        }
    } catch (e) {
        next(e);
    }
};
