export const enum ReplyEnum {
    blog,
    essay,
}

export const enum VerifycodeEnum {
    register,
    retrieve,
}

export const enum DownloadFileTypeEnum {
    file,
    folder,
}

export const enum StatusEnum {
    Continue = 100,
    OK = 200,
    NoResult = 204,
    Unauthorized = 401,
    NotFound = 404,
    Forbidden = 403,
    MethodNotAllowed = 405,
    ParameterNotAllow = 422,
    TimeOut = 408,
    UnsupportedMediaType = 415,
    ServerError = 500,
}

// 权限最多31种
export const enum AuthorityEnum {
    admin = 1, // 管理员
    blog = 2, // 写博客
    pan_private = 2 << 1, // 使用私有网盘
    pan_public = 2 << 2, // 上传文件到公开网盘
}
