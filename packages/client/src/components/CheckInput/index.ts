export { default as default } from "./CheckInput.vue";

import type { Validator } from "sdt3";
type funcName = keyof Omit<
    Validator,
    "data" | "errorMsg" | "check" | "checkArr" | "checkAll" | "end" | "addCheck"
>;
export type CheckRules = [funcName, any, string?] | [Validator.CheckFunc, string?];
