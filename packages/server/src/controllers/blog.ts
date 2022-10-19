import { BlogDB } from "../db";
import { StatusEnum } from "../typings/enum";
import type {
    BlogDetailInfo,
    BlogListItemInfo,
    HomePageOptions,
    SearchBlogByKeywordOptions,
    SearchBlogByTagOptions,
    WriteBlogOptions,
} from "../typings/interface/blog";
import deleteRepeat from "../utils/deleteRepeat";
import { successResponse, failResponse } from "../utils/createResponse";
const blogPageCount = +process.env.blogPageCount;

/** 获得主页博客列表 */
export const homePage: GetHandler<HomePageOptions> = async (req, res, next) => {
    try {
        const page = req.query.page ?? 1;

        let allPage = Math.ceil((await BlogDB.find().count()) / blogPageCount);

        let blogList = await BlogDB.find()
            .sort({ createdAt: -1 })
            .limit(blogPageCount)
            .skip(((page as number) - 1) * blogPageCount)
            .populate("author")
            .populate("tags");

        const blogListSend = blogList.map((item) => {
            const result = item.toJSON() as unknown as BlogDetailInfo;
            // @ts-ignore 强制改了
            result.contentLength = result.content?.length;
            // @ts-ignore
            delete result.content;
            return result;
        });

        successResponse(res, {
            data: {
                blogList: blogListSend,
                allPage,
            },
        });
    } catch (e) {
        successResponse(res, {
            data: { blogList: [], allPage: undefined },
        });
    }
};

/** 获得所有博客的创作时间和标题 */
export const timeLine: GetHandler = async (req, res, next) => {
    try {
        const timeLine = await BlogDB.find().sort({ createdAt: -1 }).select({ createdAt: 1, title: 1 });
        successResponse(res, { data: timeLine });
    } catch (e) {
        successResponse(res, { data: [] });
    }
};

/** 博客详情 */
export const getDetail: GetHandler<any, { blogId: string }> = async (req, res, next) => {
    try {
        // 每次调用增加一个阅读量
        const detail = await BlogDB.findByIdAndUpdate(req.params.blogId, {
            $inc: { read: 1 },
        })
            .populate("author")
            .populate("tags");
        successResponse(res, { data: { ...detail!.toJSON() } });
    } catch (e) {
        failResponse(res, { code: StatusEnum.NotFound, msg: "没有找到该博客" });
    }
};

/** 查找博客 */
export const search: GetHandler<SearchBlogByKeywordOptions & SearchBlogByTagOptions> = async (
    req,
    res,
    next
) => {
    try {
        const { tag, keyword, page } = req.query;
        let searchResult;
        let blogList: BlogListItemInfo[];
        let allPage!: number;
        //todo tag查找
        if (tag) {
            allPage = Math.ceil((await BlogDB.find({ tags: tag }).count()) / blogPageCount);
            searchResult = await BlogDB.find({ tags: tag })
                .limit(blogPageCount)
                .skip(((page as number) - 1) * blogPageCount)
                .populate("author")
                .populate("tags");
        } else if (keyword) {
            //todo 关键字查找 空格分割
            const keys = keyword.split(" ");
            let blogListMap: BlogDetailInfo[][] = await Promise.all(
                keys.map(async (key) => {
                    const regexp = new RegExp(key);
                    // 在标题 介绍 正文中找关键字
                    return BlogDB.find({
                        $or: [{ title: regexp }, { content: regexp }, { description: regexp }],
                    })
                        .populate("author")
                        .populate("tags");
                })
            );

            allPage = 1; //! 不会分页查 就摆烂了
            searchResult = deleteRepeat(blogListMap.flat(Infinity), "_id");
        }

        blogList = searchResult!.map((item: any) => {
            const result = item.toJSON();
            result.contentLength = result.content.length;
            delete result.content;
            return result as BlogListItemInfo;
        });
        successResponse(res, {
            data: { blogList, allPage },
        });
    } catch (e) {
        successResponse(res, {
            data: {
                blogList: [],
                allPage: undefined,
            },
        });
    }
};

/** 写博客 */
export const write: PostHandler<WriteBlogOptions> = async (req, res, next) => {
    try {
        const blog = new BlogDB({ ...req.body.blogMsg, author: req.body._id });
        await blog.save();

        successResponse(res);
    } catch (e) {
        next(e);
    }
};

/** 删除博客 */
export const remove: DeleteHandler<any, { blogId: string }> = async (req, res, next) => {
    try {
        await BlogDB.findByIdAndRemove(req.params.blogId);

        successResponse(res);
    } catch (e) {
        next(e);
    }
};

/** 修改博客 */
export const update: PutHandler<WriteBlogOptions, { blogId: string }> = async (req, res, next) => {
    try {
        await BlogDB.findByIdAndUpdate(req.params.blogId, { $set: { ...req.body.blogMsg } });
        successResponse(res);
    } catch (e) {
        next(e);
    }
};

/** 点赞 */
export const like: PutHandler<any, { blogId: string }> = async (req, res, next) => {
    try {
        await BlogDB.findByIdAndUpdate(req.params.blogId, { $inc: { likes: 1 } });
        successResponse(res);
    } catch (e) {
        next(e);
    }
};

/** 取消点赞 */
export const unlike: PutHandler<any, { blogId: string }> = async (req, res, next) => {
    try {
        await BlogDB.findByIdAndUpdate(req.params.blogId, { $inc: { likes: -1 } });
        successResponse(res);
    } catch (e) {
        next(e);
    }
};
