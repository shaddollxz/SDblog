import fs from "fs-extra";
import { resolve } from "path";
import { StatusEnum } from "../typings/enum";
import { fileHash } from "../utils/fileHash";
import { filenameSlice } from "../utils/formateFilename";
import { successResponse, failResponse } from "../utils/createResponse";
import { assetsViewPath, assetsRealPath } from "../utils/assetsPath";

export const uploadImage: PostHandler = async (req, res, next) => {
    try {
        const file = req.file;
        if (file) {
            const fileName = file.originalname;
            const hash = await fileHash(file.path);
            if (hash == filenameSlice(fileName).prefix) {
                successResponse(res, {
                    data: {
                        imgSrc: assetsViewPath + "/image/" + fileName,
                    },
                });
            } else {
                failResponse(res, { code: StatusEnum.ServerError, msg: "文件传输中丢失信息" });
                fs.remove(file.path);
            }
        }
    } catch (e) {
        next(e);
    }
};

export const removeImage: DeleteHandler<{ src: string }> = async (req, res, next) => {
    try {
        const regexp = new RegExp(`(?<=^${assetsViewPath}/).+`);
        const dir = req.body.src.match(regexp)?.[0];
        if (dir) {
            await fs.remove(resolve(assetsRealPath, dir));
        }
        successResponse(res);
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
                successResponse(res, {
                    data: {
                        imgSrc: assetsViewPath + "/avatar/" + fileName,
                    },
                });
            } else {
                failResponse(res, { code: StatusEnum.ServerError, msg: "文件传输中丢失信息" });
                fs.remove(file.path);
            }
        }
    } catch (e) {
        next(e);
    }
};
