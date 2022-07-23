import { EssayDB } from "../db";
import { StatusEnum } from "../typings/enum";
import type {
    EssayListOptions,
    LikeEssayOptions,
    RemoveEssayOptions,
    WriteEssayOptions,
} from "../typings/interface/essay";
const essayPageCount = +process.env.essayPageCount;

// 随笔列表
export const essayList: GetHandler<EssayListOptions> = async (req, res, next) => {
    try {
        const page = req.query.page || 1;
        const allPage = Math.ceil((await EssayDB.find().count()) / essayPageCount);
        const essayList = await EssayDB.find()
            .skip((page - 1) * essayPageCount)
            .limit(essayPageCount)
            .sort({ createdAt: -1 })
            .populate("author");

        res.status(StatusEnum.OK).json({ essayList, allPage });
    } catch (e) {
        next(e);
    }
};

// 新随笔
export const write: PostHandler<WriteEssayOptions> = async (req, res, next) => {
    try {
        const essay = new EssayDB({ author: req.body._id, content: req.body.content });
        await essay.save();
        next();
    } catch (e) {
        next(e);
    }
};

// 删除随笔
export const remove: DeleteHandler<RemoveEssayOptions> = async (req, res, next) => {
    try {
        await EssayDB.findByIdAndDelete(req.body.essayId);
        next();
    } catch (e) {
        next(e);
    }
};

// 点赞
export const like: PutHandler<LikeEssayOptions> = async (req, res, next) => {
    try {
        await EssayDB.findByIdAndUpdate(req.body.essayId, { $inc: { likes: 1 } });
        res.status(StatusEnum.OK).json({ success: true });
    } catch (e) {
        next(e);
    }
};
