import { AuthorityEnum } from "../typings/enum";

/** 验证是否有权限 */
export function authorityCheck(user: number | undefined, want: AuthorityEnum) {
    if (!user) return false;
    if (user & 1) return true;
    return !!(user & want);
}

/** 添加权限 */
export function addAuthority(user: number, ...add: AuthorityEnum[]) {
    return add.reduce((pre, cur) => (pre |= cur), user);
}

/** 删除权限 */
export function subAuthority(user: number, ...sub: AuthorityEnum[]) {
    return sub.reduce((pre, cur) => (pre &= ~cur), user);
}
