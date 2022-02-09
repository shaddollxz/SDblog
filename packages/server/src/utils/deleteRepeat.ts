/** 查找数组中的对象 如果指定键值相同则删除 */
export default function (arr: any[], key: string) {
    const cache = Object.create(null);
    return arr.filter((item) => {
        if (cache[item[key]]) {
            return false;
        } else {
            cache[item[key]] = true;
            return true;
        }
    });
}
