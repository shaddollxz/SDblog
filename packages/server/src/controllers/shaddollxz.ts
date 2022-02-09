import { User, Blog } from "../db";
import { StatusEnum } from "#interface";

export const detail: GetHandler = async (req, res, next) => {
    try {
        const data = await User.findOne({ email: "shaddollxz@163.com" });
        const blogCount = await Blog.find({ author: data!._id }).count();
        res.status(StatusEnum.OK).json({
            ...data,
            blogCount,
        });
    } catch (e) {
        next(e);
    }
};
