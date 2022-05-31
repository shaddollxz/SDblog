import { SDMath } from "sdt3";
import type { FormatNumber } from "#/globalProperties";

const formatNumber: FormatNumber = (number, precision = -2, isSlice = true) =>
    isSlice ? SDMath.ceil(number, precision).toLocaleString("en-US") : "" + SDMath.ceil(number, precision);

export default formatNumber;
