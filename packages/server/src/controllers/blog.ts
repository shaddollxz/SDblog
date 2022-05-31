import { Blog } from "../db";
import type {
    BlogDetailInfo,
    BlogListItemInfo,
    HomePageOptions,
    SearchBlogByKeywordOptions,
    SearchBlogByTagOptions,
    WriteBlogOptions,
} from "#interface";
import deleteRepeat from "../utils/deleteRepeat";
const blogPageCount = +process.env.blogPageCount!;
import { StatusEnum } from "#interface";

/** 获得主页博客列表 */
export const homePage: GetHandler<HomePageOptions> = async (req, res, next) => {
    try {
        const page = req.query.page ?? 1;

        let allPage = Math.ceil((await Blog.find().count()) / blogPageCount);

        let blogList = await Blog.find()
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

        res.status(StatusEnum.OK).json({
            blogList: blogListSend,
            allPage,
        });
    } catch (e) {
        res.status(StatusEnum.OK).json({ blogList: [], allPage: undefined });
    }
};

/** 获得所有博客的创作时间和标题 */
export const timeLine: GetHandler = async (req, res, next) => {
    try {
        const timeLine = await Blog.find().sort({ createdAt: -1 }).select({ createdAt: 1, title: 1 });
        res.status(StatusEnum.OK).json(timeLine);
    } catch (e) {
        res.status(StatusEnum.OK).json([]);
    }
};

/** 博客详情 */
export const getDetail: GetHandler<any, { blogId: string }> = async (req, res, next) => {
    try {
        // 每次调用增加一个阅读量
        const detail = await Blog.findByIdAndUpdate(req.params.blogId, {
            $inc: { read: 1 },
        })
            .populate("author")
            .populate("tags");
        res.status(StatusEnum.OK).json({ ...detail.toJSON() });
    } catch (e) {
        res.status(StatusEnum.notFound).json({ error: "没有找到该博客", isShow: true });
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
            allPage = Math.ceil((await Blog.find({ tags: tag }).count()) / blogPageCount);
            searchResult = await Blog.find({ tags: tag })
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
                    return Blog.find({
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
        res.status(StatusEnum.OK).json({ blogList, allPage });
    } catch (e) {
        res.status(StatusEnum.OK).json({ blogList: [], allPage: undefined });
    }
};

/** 写博客 */
export const write: PostHandler<WriteBlogOptions> = async (req, res, next) => {
    try {
        const blog = new Blog({ ...req.body.blogMsg, author: req.body._id });
        await blog.save();

        res.status(StatusEnum.OK).json({ success: true });
    } catch (e) {
        next(e);
    }
};

/** 删除博客 */
export const remove: DeleteHandler<any, { blogId: string }> = async (req, res, next) => {
    try {
        await Blog.findByIdAndRemove(req.params.blogId);

        res.status(StatusEnum.OK).json({ success: true });
    } catch (e) {
        next(e);
    }
};

/** 修改博客 */
export const update: PutHandler<WriteBlogOptions, { blogId: string }> = async (req, res, next) => {
    try {
        await Blog.findByIdAndUpdate(req.params.blogId, { $set: { ...req.body.blogMsg } });
        res.status(StatusEnum.OK).json({ success: true });
    } catch (e) {
        next(e);
    }
};

/** 点赞 */
export const like: PutHandler<any, { blogId: string }> = async (req, res, next) => {
    try {
        await Blog.findByIdAndUpdate(req.params.blogId, { $inc: { likes: 1 } });
        res.status(StatusEnum.OK).json({ success: true });
    } catch (e) {
        next(e);
    }
};

/** 取消点赞 */
export const unlike: PutHandler<any, { blogId: string }> = async (req, res, next) => {
    try {
        await Blog.findByIdAndUpdate(req.params.blogId, { $inc: { likes: -1 } });
        res.status(StatusEnum.OK).json({ success: true });
    } catch (e) {
        next(e);
    }
};
