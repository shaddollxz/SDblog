import type { PanPath, Folder as FolderJSON } from "#interface";
import { v4 as uuidV4 } from "uuid";

export default class Folder {
    folder: FolderJSON;
    constructor(json: string) {
        this.folder = JSON.parse(json);
    }

    json() {
        return JSON.stringify(this.folder);
    }

    findByPath(path: PanPath) {
        if (path == "/") return { target: this.folder, father: null, index: undefined };

        const pathArr = path.split("/");
        pathArr.shift();

        let result: FolderJSON | undefined = this.folder;
        let father: FolderJSON = this.folder;
        let targetIndex: number | undefined;
        pathArr.forEach((foldername, index) => {
            if (index <= pathArr.length - 1) {
                result && (father = result);
            }
            if (result && result.folders) {
                targetIndex = result.folders.findIndex((folder) => folder.name == foldername);
                result = targetIndex == -1 ? undefined : result.folders[index];
            }
        });
        return { target: result, father, index: targetIndex };
    }

    findById(id: string) {
        try {
            Folder.foreach(this.folder, (item) => {
                if (item.id == id) {
                    throw item;
                }
            });
        } catch (e) {
            return e;
        }
    }

    create(path: PanPath, name: string) {
        const folder: FolderJSON = {
            name,
            id: uuidV4(),
        };
        const { target } = this.findByPath(path);
        if (target) {
            if (target.folders) {
                if (target.folders.findIndex((item) => item.name == name) != -1) {
                    throw "不能添加同名文件夹";
                }
                target.folders.push(folder);
            } else {
                target.folders = [folder];
            }
        } else {
            throw "找不到目标文件夹";
        }
    }

    remove(path: PanPath): { folderIds: string[]; errors: string[] };
    remove(path: PanPath[]): { folderIds: string[]; errors: string[] };
    remove(path: PanPath | PanPath[]) {
        const folderIds: string[] = [];
        const paths = typeof path == "string" ? [path] : path;
        const errors: string[] = [];
        for (const path_ of paths) {
            const { target, father, index } = this.findByPath(path_);

            if (target) {
                Folder.foreach(target, (item) => folderIds.push(item.id));
                father!.folders?.splice(index!, 1);
            } else {
                errors.push(path_);
            }
        }

        return { folderIds, errors };
    }

    static foreach(folder: FolderJSON, cb: (item: FolderJSON) => void) {
        cb(folder);
        if (folder.folders) {
            folder.folders.forEach((item) => this.foreach(item, cb));
        }
    }
}
