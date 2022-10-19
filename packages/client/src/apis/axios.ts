import { default as AXIOS } from "axios";
import type { AxiosRequestConfig, AxiosPromise, Axios } from "axios";
import { Message } from "sdt3";
import Token from "@/storages/token";

// 这些url的超时会直接忽略
const timeoutExclude = ["pan/file/end"];

// 添加类型
declare type ApiWrapper<T = any> = Promise<{
    res: Awaited<AxiosPromise<T>>;
    data: T;
    code: number;
    msg?: string;
}>;
interface MyAxiosInstance extends Axios {
    <T>(config: AxiosRequestConfig): ApiWrapper<T>;
    <T>(url: string, config?: AxiosRequestConfig): ApiWrapper<T>;
}

const axios = AXIOS.create({
    baseURL: "/api",
    timeout: 5000,
    withCredentials: true,
}) as unknown as MyAxiosInstance;

axios.interceptors.request.use(
    (req) => {
        let token = Token.get();
        if (token) {
            req.headers!.Authorization = token;
        }
        if (req.data instanceof FormData) {
            req.timeout = 50000;
        }
        return req;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    (res) => {
        return { res, ...res.data };
    },
    (err) => {
        // 后端传来的错误
        if (err.response.data) {
            // 该错误可以显示则显示 否则抛到调用api的地方
            if (err.response.data.msg) {
                Message.error(err.response.data.msg);
            }
            return Promise.reject(err.response.data);
        } else {
            // 需要忽略的超时错误
            if (timeoutExclude.includes(err.config.url)) {
                return Promise.reject();
            }
            Message.error("响应超时，请稍后再试");
            return Promise.reject({ timeout: true });
        }
    }
);

export default axios;
