import { describe, it, expect, vi } from "vitest";
import Folder from "../src/utils/Folder";
import { v4 } from "uuid";

describe("Folder", () => {
    vi.mock("uuid", () => ({
        v4: () => 123456,
    }));

    it("文件夹格式化", () => {
        const _folder: Folder["folder"] = {
            id: v4(),
            name: "root",
        };
        const folderStr = JSON.stringify(_folder);
        const folder = new Folder(folderStr);

        expect(folder.folder).toEqual(_folder);
        expect(folder.json()).toBe(folderStr);
    });

    it("文件夹增加", () => {
        const _folder: Folder["folder"] = {
            id: v4(),
            name: "root",
        };
        const folderStr = JSON.stringify(_folder);
        const folder = new Folder(folderStr);

        try {
            folder.create("/", "newFolder_1");
        } catch (e) {
            console.log(e);
        }
        expect(folder.folder).toEqual({
            id: v4(),
            name: "root",
            folders: [
                {
                    id: v4(),
                    name: "newFolder_1",
                },
            ],
        });

        try {
            folder.create("/", "newFolder_2");
        } catch (e) {
            console.log(e);
        }
        expect(folder.folder).toEqual({
            id: v4(),
            name: "root",
            folders: [
                { id: v4(), name: "newFolder_1" },
                { id: v4(), name: "newFolder_2" },
            ],
        });

        try {
            folder.create("/newFolder_1", "inner_1");
        } catch (e) {
            console.log(e);
        }
        expect(folder.folder).toEqual({
            id: v4(),
            name: "root",
            folders: [
                { id: v4(), name: "newFolder_1", folders: [{ id: v4(), name: "inner_1" }] },
                { id: v4(), name: "newFolder_2" },
            ],
        });

        try {
            folder.create("/newFolder_1/inner_1", "inner_deep");
        } catch (e) {
            console.log(e);
        }
        expect(folder.folder).toEqual({
            id: v4(),
            name: "root",
            folders: [
                {
                    id: v4(),
                    name: "newFolder_1",
                    folders: [{ id: v4(), name: "inner_1", folders: [{ id: v4(), name: "inner_deep" }] }],
                },
                { id: v4(), name: "newFolder_2" },
            ],
        });

        try {
            folder.create("/newFolder_2", "inner_2");
        } catch (e) {
            console.log(e);
        }
        expect(folder.folder).toEqual({
            id: v4(),
            name: "root",
            folders: [
                {
                    id: v4(),
                    name: "newFolder_1",
                    folders: [{ id: v4(), name: "inner_1", folders: [{ id: v4(), name: "inner_deep" }] }],
                },
                { id: v4(), name: "newFolder_2", folders: [{ id: v4(), name: "inner_2" }] },
            ],
        });
    });

    it("文件夹删除 单选删除", () => {
        const _folder: Folder["folder"] = {
            id: v4(),
            name: "root",
            folders: [
                { id: v4(), name: "path_1", folders: [{ id: v4(), name: "path_deep" }] },
                {
                    id: v4(),
                    name: "path_2",
                    folders: [
                        { id: v4(), name: "path_deep", folders: [{ id: v4(), name: "path_moredeep" }] },
                    ],
                },
                { id: v4(), name: "path_3" },
            ],
        };
        const folderStr = JSON.stringify(_folder);
        const folder = new Folder(folderStr);

        expect(folder.remove("/path_1/path_deep").folderIds).toEqual([v4()]);
        expect(folder.folder).toEqual({
            id: v4(),
            name: "root",
            folders: [
                { id: v4(), name: "path_1", folders: [] },
                {
                    id: v4(),
                    name: "path_2",
                    folders: [
                        { id: v4(), name: "path_deep", folders: [{ id: v4(), name: "path_moredeep" }] },
                    ],
                },
                { id: v4(), name: "path_3" },
            ],
        });

        expect(folder.remove("/path_1").folderIds).toEqual([v4()]);
        expect(folder.folder).toEqual({
            id: v4(),
            name: "root",
            folders: [
                {
                    id: v4(),
                    name: "path_2",
                    folders: [
                        { id: v4(), name: "path_deep", folders: [{ id: v4(), name: "path_moredeep" }] },
                    ],
                },
                { id: v4(), name: "path_3" },
            ],
        });

        expect(folder.remove("/path_2").folderIds).toEqual([v4(), v4(), v4()]);
        expect(folder.folder).toEqual({ id: v4(), name: "root", folders: [{ id: v4(), name: "path_3" }] });
    });

    it("文件夹删除 多选删除 删除根目录", () => {
        const _folder: Folder["folder"] = {
            id: v4(),
            name: "root",
            folders: [
                { id: "path_1", name: "path_1", folders: [{ id: "path_deep", name: "path_deep" }] },
                {
                    id: "path_2",
                    name: "path_2",
                    folders: [
                        {
                            id: "path_deep",
                            name: "path_deep",
                            folders: [{ id: "path_moredeep", name: "path_moredeep" }],
                        },
                    ],
                },
                { id: "path_3", name: "path_3", folders: [{ id: "path_deep", name: "path_deep" }] },
            ],
        };
        const folderStr = JSON.stringify(_folder);
        const folder = new Folder(folderStr);

        expect(folder.remove(["/path_1/path_deep", "/path_2/path_deep"]).folderIds).toEqual([
            "path_deep",
            "path_deep",
            "path_moredeep",
        ]);
        expect(folder.folder).toEqual({
            id: v4(),
            name: "root",
            folders: [
                { id: "path_1", name: "path_1", folders: [] },
                {
                    id: "path_2",
                    name: "path_2",
                    folders: [],
                },
                { id: "path_3", name: "path_3", folders: [{ id: "path_deep", name: "path_deep" }] },
            ],
        });

        expect(folder.remove("/").folderIds).toEqual(["path_1", "path_2", "path_3", "path_deep"]);
        expect(folder.folder).toEqual({
            id: v4(),
            name: "root",
        });
    });
});
