import { describe, it, expect } from "vitest";
import formateBit from "../src/plugins/globalProperties/formatBit";

describe("formateBit", () => {
    it("test", () => {
        expect(formateBit(1024)).toBe("1KB");
        expect(formateBit(1024 * 3)).toBe("3KB");
        expect(formateBit(14594)).toBe("14.3KB");
        expect(formateBit(749514678)).toBe("714.8MB");
        expect(formateBit(91002922479)).toBe("84.8GB");
    });
});
