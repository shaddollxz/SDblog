import { default as Axios } from "axios";
import { Message } from "sdt3";
import Token from "@/utils/token";

const axios = Axios.create({
    baseURL: "/api",
    timeout: 5000,
    withCredentials: true,
});

axios.interceptors.request.use(
    (req) => {
        let token = Token.get();
        if (token) {
            req.headers!.Authorization = token;
        }
        return req;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    (res) => {
        return res;
    },
    (e) => {
        // 后端传来的错误
        if (e.response) {
            // 该错误可以显示则显示 否则抛到调用api的地方
            if (e.response.data.isShow) {
                Message.error(e.response.data.error);
                return Promise.reject(e.response.data);
            } else {
                return Promise.reject(e.response.data);
            }
        } else {
            Message.error("响应超时，请稍后再试");
            return Promise.reject({ error: "响应超时", timeout: true });
        }
    }
);

export default axios;
