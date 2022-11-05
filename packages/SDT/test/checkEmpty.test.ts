import { describe, it, expect, vi } from "vitest";
import { isEmpty, deleteEmpty } from "../src/methods/checkEmpty";

describe("isEmpty", () => {
    it("基本类型", () => {
        expect(isEmpty("")).toBe(true);
        expect(isEmpty(0)).toBe(false);
        expect(isEmpty(0, true)).toBe(true);
        expect(isEmpty(undefined)).toBe(true);
        expect(isEmpty(null)).toBe(true);
    });
    it("数组对象", () => {
        expect(isEmpty([])).toBe(true);
        expect(isEmpty({})).toBe(true);
    });
    it("含空元素对象", () => {
        expect(isEmpty(["", undefined, [], {}])).toBe(true);
        expect(isEmpty(["", undefined, [], {}, 0])).toBe(false);
        expect(isEmpty(["", undefined, [], {}, 0], true)).toBe(true);
    });
    it("多次嵌套", () => {
        expect(isEmpty([[[[[[[[[[]]]]]]]]]])).toBe(true);
        expect(isEmpty({ a: { b: { c: { d: { f: {}, g: [[[[[""]]]]] } }, h: "" }, i: {} } })).toBe(true);
    });
});

describe("deleteEmpty", () => {
    it("deleteEmpty", () => {
        expect(deleteEmpty([0, "", {}, [], undefined, null])).toEqual([0]);
        expect(deleteEmpty({ a: {}, b: "", c: undefined })).toEqual({});
        expect(deleteEmpty([[[[[[[[]]]]]]]])).toEqual([]);
        expect(deleteEmpty({ a: {}, b: {}, c: { d: { e: ["", [[[[]]], ""]] }, f: undefined } })).toEqual({});
    });
});
