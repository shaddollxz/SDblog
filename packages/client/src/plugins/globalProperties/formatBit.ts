import type { FormatBit } from "@/typings/global/globalProperties";
import { SDMath } from "sdt3";

const B = 1024,
    KB = 1024 ** 2,
    MB = 1024 ** 3,
    GB = 1024 ** 4;

const formatBit: FormatBit = (size, precision = 1) => {
    if (size < B) {
        return size + "B";
    } else if (size < KB) {
        return SDMath.ceil(size / B, precision) + "KB";
    } else if (size < MB) {
        return SDMath.ceil(size / KB, precision) + "MB";
    } else if (size < GB) {
        return SDMath.ceil(size / MB, precision) + "GB";
    } else {
        return SDMath.ceil(size / GB, precision) + "GB";
    }
};

export default formatBit;
