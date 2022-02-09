import type { RequestHandler } from "express";

type ReqBody<T = any, P = Record<string, string>> = RequestHandler<
    P,
    any,
    T & { _id?: string; isAdmin?: boolean }
>;
type ReqQuery<T = any, P = Record<string, string>> = RequestHandler<
    P,
    any,
    { _id?: string; isAdmin?: boolean },
    T
>;
declare global {
    type PostHandler<T = any, P = Record<string, string>> = ReqBody<T, P>;
    type DeleteHandler<T = any, P = Record<string, string>> = ReqBody<T, P>;
    type PutHandler<T = any, P = Record<string, string>> = ReqBody<T, P>;
    type GetHandler<T = any, P = Record<string, string>> = ReqQuery<T, P>;
    type MiddleWare = RequestHandler;
    interface Faild {
        error: string;
        isShow: boolean;
    }
    interface Success {
        success: true;
    }

    type NumberString = `${number}`;
}

export {};
