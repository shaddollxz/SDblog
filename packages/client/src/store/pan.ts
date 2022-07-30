import { defineStore } from "pinia";
import {
    panFolderApi,
    createPanFolderApi,
    removePanFolderApi,
    movePanFolderApi,
    renamePanFolderApi,
    removePanFileApi,
    renamePanFileApi,
    movePanFileApi,
} from "@apis";
import type { Folder, PanPath } from "@blog/server";

interface State {
    folder: Folder;
    currentPathFolder: Folder[];
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
            return this.currentPathFolder.at(-1) ?? { id: "", name: "root", folders: [], files: [] };
            // const pathArr = this.currentPath.split("/");
            // pathArr.splice(0, 2);
            // let result = this.folder;

            // pathArr.forEach((foldername) => {
            //     if (result && result.folders) {
            //         const targetIndex = result.folders.findIndex((folder) => folder.name == foldername);
            //         result = result.folders[targetIndex];
            //     }
            // });

            // return result;
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
        isRoot(): Boolean {
            return this.currentPathFolder.length >= 1;
        },
    },
    actions: {
        /** 刷新整个文件夹结构 */
        refresh(folderJson: Folder | string) {
            this.folder =
                typeof folderJson == "string"
                    ? (JSON.parse(folderJson) as Folder)
                    : (folderJson as unknown as Folder);
            this.currentPathFolder[0] = this.folder;
        },
        /** 单纯路径跳转时通过缓存可以有优化，如果涉及文件（夹）修改，需要使用该函数手动刷新状态 */
        refreshPathFolder(folderJson: Folder | string) {
            const pathArr = this.currentPath.split("/");
            pathArr.splice(0, 2);
            this.refresh(folderJson);
            const result: Folder[] = [this.folder];
            pathArr.forEach((foldername) => {
                result.push(result.at(-1)!.folders!.find((item) => item.name == foldername)!);
            });
            this.currentPathFolder = result;
        },
        async getFolder() {
            const { data } = await panFolderApi();
            this.refresh(data.folderJson);
        },

        // #region 路径跳转
        /** 下一级的某一个目录 */
        toInnerPath(folderId: string) {
            if (this.currentFolder.folders) {
                const folder = this.currentFolder.folders.find((item) => item.id == folderId)!;
                this._currentFolder = folder;
                this.currentPathFolder.push(folder);
            }
        },
        /** 上一级目录 */
        toUpperPath() {
            if (this.currentPath != "/root") {
                this.currentPathFolder.pop();
                this._currentFolder = this.currentPathFolder.at(-1);
            }
        },
        /** 指定路径跳转 */
        toThisPath(folderId: string) {
            if (this.currentPath != "/root") {
                const index = this.currentPathFolder.findIndex((item) => item.id == folderId);
                this._currentFolder = this.currentPathFolder[index];
                this.currentPathFolder.splice(index + 1);
            }
        },
        // #endregion

        // #region 文件夹操作
        async createFolder(name: string) {
            const { data } = await createPanFolderApi({ path: this.folderPath, name });
            this.refreshPathFolder(data.folderJson);
            this._currentFolder = undefined;
        },
        async renameFolder(oldName: string, name: string) {
            const { data } = await renamePanFolderApi({
                path: formatPath(`${this.folderPath}/${oldName}`),
                name,
            });
            this.refreshPathFolder(data.folderJson);
            this._currentFolder = undefined;
        },
        /** 删除文件夹 */
        async removeFolder(names: string[]) {
            const { data } = await removePanFolderApi({
                path: names.map((name) => formatPath(`${this.folderPath}/${name}`) as PanPath),
            });
            this.refreshPathFolder(data.folderJson);
            this._currentFolder = undefined;
        },
        /** 移动到下一层 / 上一层 */
        async moveFolderToNear(from_: string, to_: string) {
            const from = formatPath(`${this.folderPath}/${from_}`);
            let to: PanPath;
            if (to_ == "..") {
                if (this.folderPath == "/") return;
                to = this.folderPath.replace(/\/[^\/]*$/, "") as PanPath;
            } else {
                to = (this.folderPath + "/" + to_) as PanPath;
            }
            to = formatPath(to);
            const { data } = await movePanFolderApi({ from, to });
            this.refreshPathFolder(data.folderJson);
            this._currentFolder = undefined;
        },
        // #endregion

        // #region 文件操作
        async renameFile(fileId: string, name: string, index: number) {
            await renamePanFileApi({ fileId, name });
            this.currentFolder!.files![index].name = name;
        },
        async removeFile(_fileIds: string[] | string) {
            const fileIds = typeof _fileIds == "string" ? [_fileIds] : _fileIds;
            await removePanFileApi({ fileIds });
            this.currentFolder.files = this.currentFolder.files?.filter(
                (item) => !fileIds.includes(item._id)
            );
        },
        async moveFileTo(_fileIds: string[] | string, folderId: string) {
            const fileIds = typeof _fileIds == "string" ? [_fileIds] : _fileIds;
            const { data } = await movePanFileApi({ fileIds, folderId });
            this.refreshPathFolder(data.folderJson);
            this._currentFolder = undefined;
        },
        // #endregion
    },
});

function formatPath(path: string): PanPath {
    return path == "" ? "/" : (path.replace(/\/\//, "/") as PanPath);
}
