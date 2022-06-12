import { StatusEnum } from "#interface";
import { resolve } from "path";
import fs from "fs-extra";
import { staticPath } from "../utils/paths";

export const uploadImage: PostHandler = async (req, res, next) => {
    try {
        const file = req.file;
        if (file) {
            res.status(StatusEnum.OK).json({
                imgSrc: "/assets/image/" + file.filename,
            });
        }
    } catch (e) {
        next(e);
    }
};

export const removeImage: DeleteHandler<{ src: string }> = async (req, res, next) => {
    try {
        const dir = req.body.src.match(/(?<=^\/assets\/).+/)?.[0];
        if (dir) {
            await fs.remove(resolve(staticPath, dir));
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
                imgSrc: "/assets/avatar/" + file.filename,
            });
        }
    } catch (e) {
        next(e);
    }
};
