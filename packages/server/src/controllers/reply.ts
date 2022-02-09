import { Reply, Essay, Blog } from "../db";
import type { WriteReplyOptions } from "#interface";
import { ReplyEnum } from "../typings/enum";
import { StatusEnum } from "#interface";

/** 评论列表 */
export const replyList: GetHandler<any, { replyMainId: string }> = async (req, res, next) => {
    try {
        res.status(StatusEnum.OK).json(await Reply.findReply(req.params.replyMainId));
    } catch (e) {
        next(e);
    }
};

/** 用户发送评论 */
export const userWriteReply: PostHandler<WriteReplyOptions> = async (req, res, next) => {
    try {
        const { content, replyTo, replyMainId, _id, type } = req.body;

        const reply = new Reply({ user: _id, content, replyTo, replyMainId, type });
        await reply.save();
        if (type == ReplyEnum.blog) {
            await Blog.findByIdAndUpdate(replyMainId, { $inc: { replyCount: 1 } });
        } else if (type == ReplyEnum.essay) {
            await Essay.findByIdAndUpdate(replyMainId, { $inc: { replyCount: 1 } });
        } else {
            return res.status(StatusEnum.ParameterNotAllow).json({ error: "未知类型" });
        }

        res.status(StatusEnum.OK).json(await Reply.findReply(replyMainId));
    } catch (e) {
        next(e);
    }
};

/** 游客发送评论 */
export const visitorWriteReply: PostHandler<WriteReplyOptions> = async (req, res, next) => {
    try {
        const { content, replyTo, replyMainId, visitorInfo, type } = req.body;

        const reply = new Reply({ visitor: visitorInfo, content, replyTo, replyMainId, type });
        await reply.save();
        if (type == ReplyEnum.blog) {
            await Blog.findByIdAndUpdate(replyMainId, { $inc: { replyCount: 1 } });
        } else if (type == ReplyEnum.essay) {
            await Essay.findByIdAndUpdate(replyMainId, { $inc: { replyCount: 1 } });
        } else {
            return res.status(StatusEnum.ParameterNotAllow).json({ error: "未知类型" });
        }

        res.status(StatusEnum.OK).json(await Reply.findReply(replyMainId));
    } catch (e) {
        next(e);
    }
};

/** 评论点赞 */
export const like: GetHandler<any, { replyId: string }> = async (req, res, next) => {
    try {
        await Reply.findByIdAndUpdate(req.params.replyId, { $inc: { likes: 1 } });
        res.status(StatusEnum.OK).json({ success: true });
    } catch (e) {
        next(e);
    }
};

/** 删除评论 */
export const remove: DeleteHandler<any, { replyId: string }> = async (req, res, next) => {
    try {
        const deleteData = await Reply.findByIdAndDelete(req.params.replyId);
        await Essay.findByIdAndUpdate(deleteData?._id, { $inc: { replyCount: -1 } });
        res.status(StatusEnum.OK).json({ success: true });
    } catch (e) {
        next(e);
    }
};

/** 用户的评论列表 */
export const userReplyList: GetHandler<any, { userId: string }> = async (req, res, next) => {
    try {
        const list = await Reply.find({ user: req.params.userId })
            .select({
                content: 1,
                replyMainId: 1,
                likes: 1,
                createdAt: 1,
                type: 1,
            })
            .limit(10)
            .skip((req.query.page - 1) * 10)
            .sort({ createdAt: -1 });
        const count = await Reply.find({ user: req.params.userId }).count();

        res.status(StatusEnum.OK).json({ list, allPage: Math.ceil(count / 10) });
    } catch (e) {
        next(e);
    }
};
