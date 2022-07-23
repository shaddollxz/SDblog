import { BlogDB, UserDB } from "../db";
import { StatusEnum } from "../typings/enum";

export const detail: GetHandler = async (req, res, next) => {
    try {
        const data = await UserDB.findOne({ email: "shaddollxz@163.com" });
        const blogCount = await BlogDB.find({ author: data!._id }).count();
        res.status(StatusEnum.OK).json({
            ...data,
            blogCount,
        });
    } catch (e) {
        next(e);
    }
};
