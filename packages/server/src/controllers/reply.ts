import { BlogDB, EssayDB, ReplyDB } from "../db";
import { ReplyEnum, StatusEnum } from "../typings/enum";
import type { WriteReplyOptions } from "../typings/interface/reply";
import { successResponse, failResponse } from "../utils/createResponse";

/** 评论列表 */
export const replyList: GetHandler<any, { replyMainId: string }> = async (req, res, next) => {
    try {
        successResponse(res, {
            data: await ReplyDB.findReply(req.params.replyMainId),
        });
    } catch (e) {
        next(e);
    }
};

/** 用户发送评论 */
export const userWriteReply: PostHandler<WriteReplyOptions> = async (req, res, next) => {
    try {
        const { content, replyTo, replyMainId, _id, type } = req.body;

        const reply = new ReplyDB({ user: _id, content, replyTo, replyMainId, type });
        await reply.save();
        if (type == ReplyEnum.blog) {
            await BlogDB.findByIdAndUpdate(replyMainId, { $inc: { replyCount: 1 } });
        } else if (type == ReplyEnum.essay) {
            await EssayDB.findByIdAndUpdate(replyMainId, { $inc: { replyCount: 1 } });
        } else {
            return res.status(StatusEnum.ParameterNotAllow).json({ error: "未知类型" });
        }

        successResponse(res, {
            data: await ReplyDB.findReply(replyMainId),
        });
    } catch (e) {
        next(e);
    }
};

/** 游客发送评论 */
export const visitorWriteReply: PostHandler<WriteReplyOptions> = async (req, res, next) => {
    try {
        const { content, replyTo, replyMainId, visitorInfo, type } = req.body;

        const reply = new ReplyDB({ visitor: visitorInfo, content, replyTo, replyMainId, type });
        await reply.save();
        if (type == ReplyEnum.blog) {
            await BlogDB.findByIdAndUpdate(replyMainId, { $inc: { replyCount: 1 } });
        } else if (type == ReplyEnum.essay) {
            await EssayDB.findByIdAndUpdate(replyMainId, { $inc: { replyCount: 1 } });
        } else {
            return res.status(StatusEnum.ParameterNotAllow).json({ error: "未知类型" });
        }

        successResponse(res, {
            data: await ReplyDB.findReply(replyMainId),
        });
    } catch (e) {
        next(e);
    }
};

/** 评论点赞 */
export const like: GetHandler<any, { replyId: string }> = async (req, res, next) => {
    try {
        await ReplyDB.findByIdAndUpdate(req.params.replyId, { $inc: { likes: 1 } });
        successResponse(res);
    } catch (e) {
        next(e);
    }
};

/** 删除评论 */
export const remove: DeleteHandler<any, { replyId: string }> = async (req, res, next) => {
    try {
        const deleteData = await ReplyDB.findByIdAndDelete(req.params.replyId);
        await EssayDB.findByIdAndUpdate(deleteData?._id, { $inc: { replyCount: -1 } });
        successResponse(res);
    } catch (e) {
        next(e);
    }
};
