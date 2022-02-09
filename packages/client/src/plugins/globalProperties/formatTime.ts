import { SDDate } from "sdt3";
import type { FormatTime } from "#/globalProperties";

const formatTime: FormatTime = (timeStr, formatStr, isUseChinese) =>
    new SDDate(timeStr).format(formatStr, isUseChinese);

export default formatTime;
