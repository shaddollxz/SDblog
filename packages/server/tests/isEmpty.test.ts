import { describe, it, expect } from "vitest";
import isEmpty from "../src/utils/isEmpty";

describe("isEmpty", () => {
    it("基础类型", () => {
        expect(isEmpty(0)).toBe(false);
        expect(isEmpty(0, true)).toBe(true);
        expect(isEmpty("")).toBe(true);
        expect(isEmpty(123)).toBe(false);
    });
    it("复杂类型", () => {
        expect(isEmpty([])).toBe(true);
        expect(isEmpty([[[]]])).toBe(true);
        expect(isEmpty([0])).toBe(false);
        expect(isEmpty([0], true)).toBe(true);
        expect(isEmpty({})).toBe(true);
        expect(isEmpty({ a: {}, b: {} })).toBe(true);
    });
});
