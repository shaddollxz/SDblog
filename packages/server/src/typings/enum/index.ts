export const enum ReplyEnum {
    blog,
    essay,
}

export const enum AuthorityEnum {
    normal,
    admin,
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
