import type { RequestHandler } from "express";

export {};

interface Token {
    _id: string;
    authority: number;
}

type ReqBody<T = any, P = Record<string, string>> = RequestHandler<P, any, T & Partial<Token>>;
type ReqQuery<T = any, P = Record<string, string>> = RequestHandler<P, any, Partial<Token>, T>;

declare global {
    type PostHandler<T = any, P = Record<string, string>> = ReqBody<T, P>;
    type DeleteHandler<T = any, P = Record<string, string>> = ReqBody<T, P>;
    type PutHandler<T = any, P = Record<string, string>> = ReqBody<T, P>;
    type GetHandler<T = any, P = Record<string, string>> = ReqQuery<T, P>;
    type MiddleWare = RequestHandler;
}
