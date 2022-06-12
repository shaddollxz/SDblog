import { defineStore } from "pinia";
import { reloginApi, loginApi, updateUserInfoApi } from "@apis";
import type { UserInfo, LoginOptions } from "@blog/server";
import { AuthorityEnum } from "@blog/server";
import token from "@/utils/token";
import { Message } from "sdt3";

type User = { userInfo: Partial<UserInfo>; isLogin: boolean; isAdmin: boolean };

export const useUserStore = defineStore("user", {
    state: (): User => ({
        userInfo: {},
        isLogin: false,
        isAdmin: false,
    }),
    getters: {
        avatars(): Pick<UserInfo, "avatar" | "avatarFrame"> {
            return { avatar: this.userInfo.avatar || "", avatarFrame: this.userInfo.avatarFrame ?? 0 };
        },
    },
    actions: {
        refreshUserInfo(data: UserInfo) {
            this.isLogin = true;
            this.isAdmin = (data.authority as unknown as AuthorityEnum) == AuthorityEnum.admin;
            this.userInfo = data;
        },

        async updateUserInfo(info: Partial<UserInfo>) {
            const { data } = await updateUserInfoApi(info);
            this.refreshUserInfo(data.userData);
            Message.success("修改成功");
        },

        async login(formData: LoginOptions) {
            const { data } = await loginApi(formData);
            this.refreshUserInfo(data.userData);
            token.set(data.token);
            Message.success("登录成功");
        },
        relogin() {
            reloginApi().then(
                ({ data }) => {
                    this.refreshUserInfo(data.userData);
                    token.set(data.token);
                },
                (e) => {
                    if (e.timeout) return Message.error("网络连接失败，请刷新页面");
                    if (e.logout) {
                        token.remove();
                        return Message.error("登录过期，请重新登录");
                    }
                }
            );
        },
        logout() {
            token.remove();
            this.isLogin = false;
            this.isAdmin = false;
            Message.success("退出成功");
        },
    },
});
