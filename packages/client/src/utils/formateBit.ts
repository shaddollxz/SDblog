import { SDMath } from "sdt3";

const B = 1024,
    KB = 1024 ** 2,
    MB = 1024 ** 3,
    GB = 1024 ** 4;
export default function formateBit(size: number): string {
    if (size < B) {
        return size + "B";
    } else if (size < KB) {
        return SDMath.ceil(size / B, 1) + "KB";
    } else if (size < MB) {
        return SDMath.ceil(size / KB, 1) + "MB";
    } else if (size < GB) {
        return SDMath.ceil(size / MB, 1) + "GB";
    } else {
        return SDMath.ceil(size / GB, 1) + "GB";
    }
}
