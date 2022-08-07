import axios from "../axios";
import type { AxiosPromise } from "axios";
import type {
    UserInfo,
    LoginOptions,
    LoginRes,
    GetVerifycodeOptions,
    RegisterOptions,
    RetrieveOptions,
    EnableAuthority,
    DisableAuthority,
    Success,
    Faild,
} from "@blog/server";
import { VerifycodeEnum } from "@blog/server";

// 登录
export function login(formData: LoginOptions): AxiosPromise<LoginRes> {
    return axios({
        method: "post",
        url: "user/login",
        data: formData,
    });
}

// 发送注册的验证码
export function sendRegisterEmail(email: GetVerifycodeOptions["email"]): AxiosPromise<Success | Faild> {
    return axios({
        method: "get",
        url: "user/verifycode",
        timeout: 10000,
        params: {
            email,
            module: VerifycodeEnum.register,
        },
    });
}

// 发送找回密码的验证码
export function sendRetrieveEmail(email: GetVerifycodeOptions["email"]): AxiosPromise<Success | Faild> {
    return axios({
        method: "get",
        url: "user/verifycode",
        timeout: 10000,
        params: {
            email,
            module: VerifycodeEnum.retrieve,
        },
    });
}

// 注册
export function register(formData: RegisterOptions): AxiosPromise<Success | Faild> {
    return axios({
        method: "post",
        url: "user",
        data: formData,
    });
}

// 获取用户信息
export function relogin(): AxiosPromise<LoginRes> {
    return axios({
        method: "get",
        url: "user/relogin",
    });
}

// 修改个人信息
export function updateUserInfo(userInfo: Partial<UserInfo>): AxiosPromise<{ userData: UserInfo }> {
    return axios({
        method: "put",
        url: "user/",
        data: userInfo,
    });
}

// 修改密码
export function changePassWord(data: RetrieveOptions): AxiosPromise<{ data: UserInfo; token: string }> {
    return axios({
        method: "put",
        url: "user/retrieve",
        data,
    });
}

export function enableAuthority(data: EnableAuthority) {
    return axios({
        method: "put",
        url: "user/authority/enable",
        data,
    });
}
export function disableAuthority(data: DisableAuthority) {
    return axios({
        method: "put",
        url: "user/authority/disable",
        data,
    });
}
