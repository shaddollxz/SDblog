import fs from "fs-extra";
import { resolve } from "path";
import { StatusEnum } from "../typings/enum";
import { fileHash } from "../utils/fileHash";
import { filenameSlice } from "../utils/formateFilename";

export const uploadImage: PostHandler = async (req, res, next) => {
    try {
        const file = req.file;
        if (file) {
            const fileName = file.originalname;
            const hash = await fileHash(file.path);
            if (hash == filenameSlice(fileName).prefix) {
                res.status(StatusEnum.OK).json({
                    imgSrc: process.env.PUBLIC_STATIC_PREFIX + "/image/" + fileName,
                });
            } else {
                res.status(StatusEnum.ServerError).json({ error: "文件传输中丢失信息", isShow: true });
                fs.remove(file.path);
            }
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
            const fileName = file.originalname;
            const hash = await fileHash(file.path);
            if (hash == filenameSlice(fileName).prefix) {
                res.status(StatusEnum.OK).json({
                    imgSrc: process.env.PUBLIC_STATIC_PREFIX + "/avatar/" + fileName,
                });
            } else {
                res.status(StatusEnum.ServerError).json({ error: "文件传输中丢失信息", isShow: true });
                fs.remove(file.path);
            }
        }
    } catch (e) {
        next(e);
    }
};
