import { defineStore } from "pinia";
import { panFolderApi, createPanFolderApi, removePanFolderApi, renamePanFolderApi } from "@apis";
import type { Folder, PanPath } from "@blog/server";

interface State {
    folder: Folder;
    currentPath: PanPath;
    _currentFolder?: Folder;
}

export const usePanStore = defineStore("panFolder", {
    state: (): State => ({
        folder: { id: "", name: "root" },
        currentPath: "/",
        _currentFolder: undefined,
    }),
    getters: {
        currentFolder(): Folder {
            if (this.currentPath == "/") return this.folder;
            if (this._currentFolder) return this._currentFolder;

            const pathArr = this.currentPath.split("/");
            pathArr.shift();
            let result = this.folder;

            pathArr.forEach((foldername) => {
                if (result && result.folders) {
                    const targetIndex = result.folders.findIndex((folder) => folder.name == foldername);
                    result = result.folders[targetIndex];
                }
            });

            return result;
        },
        currentFolderId(): string {
            return this.currentFolder.id;
        },
    },
    actions: {
        async getFolder() {
            const { data } = await panFolderApi();
            return (this.folder = data.folderJson);
        },
        async createFolder(name: string) {
            const { data } = await createPanFolderApi({ path: this.currentPath, name });
            return (this.folder = data.folderJson);
        },
        async renameFolder(name: string) {
            const { data } = await renamePanFolderApi({ path: this.currentPath, name });
            return (this.folder = data.folderJson);
        },
        async removeFolder(names: string[]) {
            const { data } = await removePanFolderApi({
                path: names.map((name) => `${this.currentPath}/${name}` as PanPath),
            });
            return (this.folder = data.folderJson);
        },

        /** 下一级的某一个目录 */
        toInnerPath(folderId: string) {
            if (this.currentFolder.folders) {
                const folder = this.currentFolder.folders.find((item) => item.id == folderId)!;
                this._currentFolder = folder;
                this.currentPath += `/${folder.name}`;
            }
        },
        /** 上一级目录 */
        toUpperPath() {
            if (this.currentPath != "/") {
                this._currentFolder = undefined;
                this.currentPath = this.currentPath.replace(/\/[^\/]+$/, "") as PanPath;
            }
        },
    },
});
