import Validator from "../utils/Validator";
import { StatusEnum } from "#interface";
import type { WriteBlogOptions } from "#interface";

export const blogValidator: MiddleWare = (req, res, next) => {
    try {
        const { blogMsg } = req.body as WriteBlogOptions;
        new Validator(blogMsg.title).notEmpty().check();
        new Validator(blogMsg.content).notEmpty().check();
        next();
    } catch (e) {
        res.status(StatusEnum.Forbidden).json({
            // @ts-ignore
            error: e.errorMsg[0],
            isShow: true,
        });
    }
};
