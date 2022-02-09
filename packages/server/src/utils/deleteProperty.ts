import type { UserInfo, Author } from "#interface";

/** 删除对象中指定的键 支持链式调用 */
export default function deleteProperties(obj: object, isDeep: boolean, ...properties: string[]) {
    if (!obj) return;
    if (isDeep) {
        for (const property of properties) {
            const arr = property.split(".");
            arr.reduce((prev, curr, index) => {
                if (index == arr.length - 1) {
                    return delete prev[curr];
                }
                return prev[curr];
            }, obj);
        }
    } else {
        for (const property of properties) {
            delete obj[property];
        }
    }
}

export const deletePassword = (user: object): user is UserInfo => {
    deleteProperties(user, false, "passWord", "__v");
    return true;
};

export const userBeAuthor = (user: object): user is Author => {
    deleteProperties(user, true, "");
    return true;
};
