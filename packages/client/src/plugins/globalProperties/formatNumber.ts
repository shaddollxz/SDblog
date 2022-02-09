import { SDMath } from "sdt3";
import type { FormatNumber } from "#/globalProperties";

const formatNumber: FormatNumber = (number) => SDMath.ceil(number, -2).toLocaleString("en-US");

export default formatNumber;
