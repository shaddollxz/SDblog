import { TagDB } from "../db";
import { StatusEnum } from "../typings/enum";
import type { CreateTagOptions } from "../typings/interface/tag";
import { successResponse, failResponse } from "../utils/createResponse";

/** 获取所有标签 */
export const getAll: GetHandler = async (req, res, next) => {
    try {
        let detail = await TagDB.find();
        successResponse(res, { data: detail });
    } catch (e) {
        next(e);
    }
};

/** 生成新标签 */
export const create: PostHandler<CreateTagOptions> = async (req, res, next) => {
    try {
        if (await TagDB.findOne({ value: req.body.value })) {
            return res.status(StatusEnum.Forbidden).json({
                error: "已经有该标签了",
                isShow: true,
            });
        }
        const tag = new TagDB({ value: req.body.value, creater: req.body._id });
        await tag.save();
        successResponse(res, { data: tag });
    } catch (e) {
        next(e);
    }
};
