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

export const enum StatusEnum {
    OK = 200,
    Unauthorized = 401,
    notFound = 404,
    Forbidden = 403,
    MethodNotAllowed = 405,
    ParameterNotAllow = 422,
    TimeOut = 408,
    UnsupportedMediaType = 415,
    ServerError = 500,
}
