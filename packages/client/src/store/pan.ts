import { defineStore } from "pinia";
import { panFolderApi, createPanFolderApi, removePanFolderApi, renamePanFolderApi } from "@apis";
import type { Folder, PanPath } from "@blog/server";

interface State {
    folder: Folder;
    currentPathFolder: { id: string; name: string }[];
    _currentFolder?: Folder;
}

export const usePanStore = defineStore("panFolder", {
    state: (): State => ({
        folder: { id: "", name: "root", folders: [], files: [] },
        currentPathFolder: [],
        _currentFolder: undefined,
    }),
    getters: {
        currentFolder(): Folder {
            if (this.currentPath == "/root") return this.folder;
            if (this._currentFolder) return this._currentFolder;

            const pathArr = this.currentPath.split("/");
            pathArr.splice(0, 2);
            let result = this.folder;

            pathArr.forEach((foldername) => {
                if (result && result.folders) {
                    const targetIndex = result.folders.findIndex((folder) => folder.name == foldername);
                    result = result.folders[targetIndex];
                }
            });

            return result;
        },
        currentPath(): PanPath {
            return this.currentPathFolder.reduce(
                (pre, cur) => pre + "/" + cur.name,
                ""
            ) as unknown as PanPath;
        },
        folderPath(): PanPath {
            return this.currentPath == "/root" ? "/" : (this.currentPath.replace("/root", "") as PanPath);
        },
    },
    actions: {
        async getFolder() {
            const { data } = await panFolderApi();
            this.folder =
                typeof data.folderJson == "string"
                    ? (JSON.parse(data.folderJson) as Folder)
                    : (data.folderJson as unknown as Folder);
            this.currentPathFolder[0] = {
                name: this.folder.name,
                id: this.folder.id,
            };
        },
        async createFolder(name: string) {
            const { data } = await createPanFolderApi({ path: this.folderPath, name });
            this.folder =
                typeof data.folderJson == "string"
                    ? (JSON.parse(data.folderJson) as Folder)
                    : (data.folderJson as unknown as Folder);
            this.currentPathFolder[0] = {
                name: this.folder.name,
                id: this.folder.id,
            };
            this._currentFolder = undefined;
        },
        async renameFolder(name: string) {
            const { data } = await renamePanFolderApi({ path: this.folderPath, name });
            this.folder =
                typeof data.folderJson == "string"
                    ? (JSON.parse(data.folderJson) as Folder)
                    : (data.folderJson as unknown as Folder);
            this.currentPathFolder[0] = {
                name: this.folder.name,
                id: this.folder.id,
            };
            this._currentFolder = undefined;
        },
        async removeFolder(names: string[]) {
            const { data } = await removePanFolderApi({
                path: names.map((name) => `${this.folderPath}/${name}` as PanPath),
            });
            this.folder =
                typeof data.folderJson == "string"
                    ? (JSON.parse(data.folderJson) as Folder)
                    : (data.folderJson as unknown as Folder);
            this.currentPathFolder[0] = {
                name: this.folder.name,
                id: this.folder.id,
            };
            this._currentFolder = undefined;
        },

        /** 下一级的某一个目录 */
        toInnerPath(folderId: string) {
            if (this.currentFolder.folders) {
                const folder = this.currentFolder.folders.find((item) => item.id == folderId)!;
                this._currentFolder = folder;
                this.currentPathFolder.push({
                    name: folder.name,
                    id: folder.id,
                });
            }
        },
        /** 上一级目录 */
        toUpperPath() {
            if (this.currentPath != "/root") {
                this._currentFolder = undefined;
                this.currentPathFolder.pop();
            }
        },
        /** 指定路径跳转 */
        toThisPath(folderId: string) {
            if (this.currentPath != "/root") {
                const index = this.currentPathFolder.findIndex((item) => item.id == folderId);
                this._currentFolder = undefined;
                this.currentPathFolder.splice(index + 1);
            }
        },

        renameFile() {},
        removeFile(id: string) {},
    },
});
