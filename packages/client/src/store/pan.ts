import { defineStore } from "pinia";
import { panFolderApi, createPanFolderApi, removePanFolderApi, renamePanFolderApi } from "@apis";
import type { Folder, PanPath } from "@blog/server";

export const useTagStore = defineStore("panFolder", {
    state: (): { folder: Folder; currentPath: PanPath } => ({
        folder: { id: "", name: "root" },
        currentPath: "/",
    }),
    getters: {
        currentFolder(): Folder {
            if (this.currentPath == "/") return this.folder;

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
    },
    actions: {
        async getFolder() {
            const { data } = await panFolderApi();
            return (this.folder = JSON.parse(data.folderJson));
        },
        async createFolder(name: string) {
            const { data } = await createPanFolderApi({ path: this.currentPath, name });
            return (this.folder = JSON.parse(data.folderJson));
        },
        async renameFolder(name: string) {
            const { data } = await renamePanFolderApi({ path: this.currentPath, name });
            return (this.folder = JSON.parse(data.folderJson));
        },
        async removeFolder(names: string[]) {
            const { data } = await removePanFolderApi({
                path: names.map((name) => `${this.currentPath}/${name}` as PanPath),
            });
            return (this.folder = JSON.parse(data.folderJson));
        },

        /** 指定文件夹的目录 */
        changePath(folderId: string) {
            if (this.currentFolder.folders) {
                const name = this.currentFolder.folders.find((item) => item.id == folderId);
                this.currentPath += `/${name}`;
            }
        },
        /** 上一级目录 */
        upperPath() {
            if (this.currentPath != "/") {
                this.currentPath = this.currentPath.replace(/\/[^\/]+$/, "") as PanPath;
            }
        },
    },
});
