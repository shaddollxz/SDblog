import axios from "../axios";
import type { AxiosPromise } from "axios";
import type {
    WriteBlogOptions,
    BlogDetailInfo,
    BlogListItemInfo,
    Success,
    Faild,
    TimeLineItemInfo,
    HomePageOptions,
    SearchBlogByKeywordOptions,
    SearchBlogByTagOptions,
} from "@blog/server";

// 主页博客列表
export function homePageBlogList(
    options: HomePageOptions["page"]
): AxiosPromise<{ blogList: BlogListItemInfo[]; allPage: number }> {
    return axios({
        method: "get",
        url: "blog/homePage",
        params: {
            page: options,
        },
    });
}

// 主页时间线
export function timeLine(): AxiosPromise<TimeLineItemInfo[]> {
    return axios({
        method: "get",
        url: "blog/timeLine",
    });
}

// 关键字查找博客
export function searchBlogByKeyWord(
    options: SearchBlogByKeywordOptions
): AxiosPromise<{ blogList: BlogListItemInfo[]; allPage: number }> {
    return axios({
        method: "get",
        url: `blog/search`,
        params: options,
    });
}

// 标签查找博客
export function searchBlogByTag(
    options: SearchBlogByTagOptions
): AxiosPromise<{ blogList: BlogListItemInfo[]; allPage: number }> {
    return axios({
        method: "get",
        url: `blog/search`,
        params: options,
    });
}

// 博客详情
export function blogDetail(id: string): AxiosPromise<BlogDetailInfo> {
    return axios({
        method: "get",
        url: "blog/detail/" + id,
    });
}

// 写博客
export function writeBlog(options: WriteBlogOptions["blogMsg"]): AxiosPromise<Success | Faild> {
    return axios({
        method: "post",
        url: "blog",
        data: {
            blogMsg: options,
        },
    });
}

// 删除博客
export function deleteBlog(blogId: string): AxiosPromise<Success | Faild> {
    return axios({
        method: "delete",
        url: "blog/" + blogId,
    });
}

// 修改博客
export function updateBlog(
    blogId: string,
    options: WriteBlogOptions["blogMsg"]
): AxiosPromise<Success | Faild> {
    return axios({
        method: "put",
        url: "blog/" + blogId,
        data: {
            blogMsg: options,
        },
    });
}

// 点赞
export function like(blogId: string): AxiosPromise<Success | Faild> {
    return axios({
        method: "put",
        url: "blog/like/" + blogId,
    });
}

// 点踩
export function unlike(blogId: string): AxiosPromise<Success | Faild> {
    return axios({
        method: "put",
        url: "blog/unlike" + blogId,
    });
}
