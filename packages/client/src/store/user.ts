import { defineStore } from "pinia";
import { reloginApi, loginApi, updateUserInfoApi } from "@apis";
import type { UserInfo, LoginOptions } from "@blog/server";
import { AuthorityEnum } from "@blog/server";
import Token from "@/storages/token";
import { Message } from "sdt3";

type User = { userInfo: Partial<UserInfo>; isLogin: boolean; authority: number };

export const useUserStore = defineStore("user", {
    state: (): User => ({
        userInfo: {},
        isLogin: false,
        authority: 0,
    }),
    getters: {
        avatars(): Pick<UserInfo, "avatar" | "avatarFrame"> {
            return { avatar: this.userInfo.avatar || "", avatarFrame: this.userInfo.avatarFrame ?? 0 };
        },
    },
    actions: {
        refreshUserInfo(data: UserInfo) {
            this.isLogin = true;
            this.authority = data.authority;
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
            Token.set(data.token);
            Message.success("登录成功");
        },
        relogin() {
            reloginApi().then(
                ({ data }) => {
                    this.refreshUserInfo(data.userData);
                    Token.set(data.token);
                },
                (e) => {
                    if (e.timeout) return Message.error("网络连接失败，请刷新页面");
                    if (e.logout) {
                        Token.remove();
                        return Message.error("登录过期，请重新登录");
                    }
                }
            );
        },
        logout() {
            Token.remove();
            this.isLogin = false;
            this.authority = 0;
            Message.success("退出成功");
        },
        /** 验证权限 */
        authorityCheck(check: AuthorityEnum) {
            if (this.authority & 1) return true;
            return !!(this.authority & check);
        },
        /** 多个权限用该方法合并 */
        multiAuthority(...authories: AuthorityEnum[]) {
            return authories.reduce((pre, cur) => (pre |= cur), 0);
        },
    },
});
