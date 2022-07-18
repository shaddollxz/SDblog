export {
    login as loginApi,
    sendRegisterEmail as sendRegisterEmailApi,
    sendRetrieveEmail as sendRetrieveEmailApi,
    register as registerApi,
    relogin as reloginApi,
    updateUserInfo as updateUserInfoApi,
    changePassWord as changePassWordApi,
} from "./ajax/user";

export {
    homePageBlogList as homePageBlogListApi,
    timeLine as timeLineApi,
    searchBlogByKeyWord as searchBlogByKeyWordApi,
    searchBlogByTag as searchBlogByTagApi,
    blogDetail as blogDetailApi,
    writeBlog as writeBlogApi,
    deleteBlog as deleteBlogApi,
    updateBlog as updateBlogApi,
    like as likeBlogApi,
    unlike as unlikeBlogApi,
} from "./ajax/blog";

export {
    essayList as essayListApi,
    essayReplyList as essayReplyListApi,
    writeEssay as writeEssayApi,
    deleteEssay as deleteEssayApi,
    like as likeEssayApi,
} from "./ajax/essay";

export {
    writeReply as writeReplyApi,
    replyList as replyListApi,
    likeReply as likeReplyApi,
} from "./ajax/reply";

export { getAllTag as getAllTagApi, addNewTag as addNewTagApi } from "./ajax/tag";

export {
    uploadImage as uploadImageApi,
    removeImage as removeImageApi,
    uploadAvatar as uploadAvatarApi,
} from "./ajax/static";

export {
    panFolder as panFolderApi,
    createPanFolder as createPanFolderApi,
    removePanFolder as removePanFolderApi,
    renamePanFolder as renamePanFolderApi,
    uploadPanFileStart as uploadPanFileStartApi,
    uploadPanFile as uploadPanFileApi,
    uploadPanFileChunk as uploadPanFileChunkApi,
    uploadPanFileEnd as uploadPanFileEndApi,
} from "./ajax/pan";

export { default as shaddollxzDetailApi } from "./ajax/shaddollxz";
