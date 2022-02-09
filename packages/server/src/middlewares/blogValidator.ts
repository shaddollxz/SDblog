import Validator from "../utils/Validator";
import { StatusEnum } from "#interface";

export const blogValidator: MiddleWare = (req, res, next) => {
    try {
        const { blogMsg } = req.body;
        new Validator(blogMsg.title).notEmpty();
        next();
    } catch (e) {
        res.status(StatusEnum.Forbidden).json({
            // @ts-ignore
            error: e.errorMsg[0],
            isShow: true,
        });
    }
};
