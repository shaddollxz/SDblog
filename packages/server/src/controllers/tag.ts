import { Tag } from "../db";
import type { CreateTagOptions } from "#interface";
import { StatusEnum } from "#interface";

/** 获取所有标签 */
export const getAll: GetHandler = async (req, res, next) => {
    try {
        let detail = await Tag.find();
        res.status(StatusEnum.OK).json(detail);
    } catch (e) {
        next(e);
    }
};

/** 生成新标签 */
export const create: PostHandler<CreateTagOptions> = async (req, res, next) => {
    try {
        if (await Tag.findOne({ value: req.body.value })) {
            return res.status(StatusEnum.Forbidden).json({
                error: "已经有该标签了",
                isShow: true,
            });
        }
        const tag = new Tag({ value: req.body.value, creater: req.body._id });
        await tag.save();
        res.status(StatusEnum.OK).json(tag);
    } catch (e) {
        next(e);
    }
};
