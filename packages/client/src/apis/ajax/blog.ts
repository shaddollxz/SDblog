import axios from "../axios";
import type {
    WriteBlogOptions,
    BlogDetailInfo,
    BlogListItemInfo,
    TimeLineItemInfo,
    HomePageOptions,
    SearchBlogByKeywordOptions,
    SearchBlogByTagOptions,
} from "@blog/server";

// 主页博客列表
export function homePageBlogList(options: HomePageOptions["page"]) {
    return axios<{ blogList: BlogListItemInfo[]; allPage: number }>({
        method: "get",
        url: "blog/homePage",
        params: {
            page: options,
        } as HomePageOptions,
    });
}

// 主页时间线
export function timeLine() {
    return axios<TimeLineItemInfo[]>({
        method: "get",
        url: "blog/timeLine",
    });
}

// 关键字查找博客
export function searchBlogByKeyWord(options: SearchBlogByKeywordOptions) {
    return axios<{ blogList: BlogListItemInfo[]; allPage: number }>({
        method: "get",
        url: `blog/search`,
        params: options,
    });
}

// 标签查找博客
export function searchBlogByTag(options: SearchBlogByTagOptions) {
    return axios<{ blogList: BlogListItemInfo[]; allPage: number }>({
        method: "get",
        url: `blog/search`,
        params: options,
    });
}

// 博客详情
export function blogDetail(id: string) {
    return axios<BlogDetailInfo>({
        method: "get",
        url: "blog/detail/" + id,
    });
}

// 写博客
export function writeBlog(options: WriteBlogOptions["blogMsg"]) {
    return axios({
        method: "post",
        url: "blog",
        data: {
            blogMsg: options,
        },
    });
}

// 删除博客
export function deleteBlog(blogId: string) {
    return axios({
        method: "delete",
        url: "blog/" + blogId,
    });
}

// 修改博客
export function updateBlog(blogId: string, options: WriteBlogOptions["blogMsg"]) {
    return axios({
        method: "put",
        url: "blog/" + blogId,
        data: {
            blogMsg: options,
        },
    });
}

// 点赞
export function like(blogId: string) {
    return axios({
        method: "put",
        url: "blog/like/" + blogId,
    });
}

// 点踩
export function unlike(blogId: string) {
    return axios({
        method: "put",
        url: "blog/unlike" + blogId,
    });
}
