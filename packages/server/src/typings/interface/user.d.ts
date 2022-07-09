import type { User } from "../../db/user";
import type { SchemaToInfo } from "../tools/SchemaToInfo";
import { VerifycodeEnum } from "../enum";

// 用户信息
export type UserInfo = SchemaToInfo<User>;

// 登录信息
export interface LoginOptions {
    email: string;
    passWord: string;
}

export interface LoginRes {
    userData: UserInfo;
    token: string;
}

// 注册信息
export interface RegisterOptions {
    name: string;
    email: string;
    passWord: string;
    verifycode: string;
}

// 找回密码
export interface RetrieveOptions {
    email: string;
    newPassWord: string;
    verifycode: string;
}

// 获取验证码
export interface GetVerifycodeOptions {
    email: string;
    model: VerifycodeEnum;
}

export type ShaddollxzInfo = UserInfo & { blogCount: number };

export {};
