import { describe, it, expect, vi } from "vitest";
import { formateFilename, originalFilename, filenameMsg } from "../src/utils/formateFilename";

describe("formateFilename", () => {
    const now = new Date("2022-1-1").getDate();
    Date.now = vi.fn(() => now);

    it("简单文件后缀", () => {
        const filename = "aaa.png";
        const extra = { aaa: "AAA", bbb: "BBB" };
        const afterFormate = formateFilename(filename);
        const afterFormateWithExtra = formateFilename(filename, extra);

        expect(afterFormate).toBe(`aaa-T${now}.png`);
        expect(originalFilename(afterFormate)).toBe(filename);
        expect(originalFilename(afterFormate, false)).toBe("aaa");
        expect(filenameMsg(afterFormate)).toEqual({ time: now });

        expect(afterFormateWithExtra).toBe(`aaa-T${now}--Oaaa-AAAE--Obbb-BBBE.png`);
        expect(originalFilename(afterFormateWithExtra)).toBe(filename);
        expect(originalFilename(afterFormateWithExtra, false)).toBe("aaa");
        expect(filenameMsg(afterFormateWithExtra)).toEqual({ time: now, ...extra });
    });

    it("复杂文件后缀", () => {
        const filename = "aaa.bbb.ccc.png";
        const extra = { aaa: "AAA", bbb: "BBB" };
        const afterFormate = formateFilename(filename);
        const afterFormateWithExtra = formateFilename(filename, extra);

        expect(afterFormate).toBe(`aaa-T${now}.bbb.ccc.png`);
        expect(originalFilename(afterFormate)).toBe(filename);
        expect(originalFilename(afterFormate, false)).toBe("aaa");
        expect(filenameMsg(afterFormate)).toEqual({ time: now });

        expect(afterFormateWithExtra).toBe(`aaa-T${now}--Oaaa-AAAE--Obbb-BBBE.bbb.ccc.png`);
        expect(originalFilename(afterFormateWithExtra)).toBe(filename);
        expect(originalFilename(afterFormateWithExtra, false)).toBe("aaa");
        expect(filenameMsg(afterFormateWithExtra)).toEqual({ time: now, ...extra });
    });

    it("无文件后缀", () => {
        const filename = "aaa";
        const extra = { aaa: "AAA", bbb: "BBB" };
        const afterFormate = formateFilename(filename);
        const afterFormateWithExtra = formateFilename(filename, extra);

        expect(afterFormate).toBe(`aaa-T${now}`);
        expect(originalFilename(afterFormate)).toBe(filename);
        expect(originalFilename(afterFormate, false)).toBe("aaa");
        expect(filenameMsg(afterFormate)).toEqual({ time: now });

        expect(afterFormateWithExtra).toBe(`aaa-T${now}--Oaaa-AAAE--Obbb-BBBE`);
        expect(originalFilename(afterFormateWithExtra)).toBe(filename);
        expect(originalFilename(afterFormateWithExtra, false)).toBe(`aaa`);
        expect(filenameMsg(afterFormateWithExtra)).toEqual({ time: now, ...extra });
    });
});
