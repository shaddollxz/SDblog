import { BlogDB, UserDB } from "../db";
import { StatusEnum } from "../typings/enum";
import { successResponse, failResponse } from "../utils/createResponse";

export const detail: GetHandler = async (req, res, next) => {
    try {
        const data = await UserDB.findOne({ email: "shaddollxz@163.com" });
        const blogCount = await BlogDB.find({ author: data!._id }).count();
        successResponse(res, {
            data: {
                ...data,
                blogCount,
            },
        });
    } catch (e) {
        next(e);
    }
};
