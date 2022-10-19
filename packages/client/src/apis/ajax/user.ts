import axios from "../axios";
import type {
    ShaddollxzInfo,
    UserInfo,
    LoginOptions,
    LoginRes,
    GetVerifycodeOptions,
    RegisterOptions,
    RetrieveOptions,
    EnableAuthorityOptions,
    DisableAuthorityOptions,
} from "@blog/server";
import { VerifycodeEnum } from "@blog/server";

export function shaddollxzDetail() {
    return axios<ShaddollxzInfo>({
        method: "get",
        url: "shaddollxz",
    });
}

// 登录
export function login(formData: LoginOptions) {
    return axios<LoginRes>({
        method: "post",
        url: "user/login",
        data: formData,
    });
}

// 发送注册的验证码
export function sendRegisterEmail(email: GetVerifycodeOptions["email"]) {
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
export function sendRetrieveEmail(email: GetVerifycodeOptions["email"]) {
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
export function register(formData: RegisterOptions) {
    return axios({
        method: "post",
        url: "user",
        data: formData,
    });
}

// 获取用户信息
export function relogin() {
    return axios<LoginRes>({
        method: "get",
        url: "user/relogin",
    });
}

// 修改个人信息
export function updateUserInfo(userInfo: Partial<UserInfo>) {
    return axios<{ userData: UserInfo }>({
        method: "put",
        url: "user/",
        data: userInfo,
    });
}

// 修改密码
export function changePassWord(data: RetrieveOptions) {
    return axios<{ userData: UserInfo; token: string }>({
        method: "put",
        url: "user/retrieve",
        data,
    });
}

export function EnableAuthorityOptions(data: EnableAuthorityOptions) {
    return axios({
        method: "put",
        url: "user/authority/enable",
        data,
    });
}
export function DisableAuthorityOptions(data: DisableAuthorityOptions) {
    return axios({
        method: "put",
        url: "user/authority/disable",
        data,
    });
}
