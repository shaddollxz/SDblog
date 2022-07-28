import { v4 as uuidV4 } from "uuid";
import type { Folder as FolderJSON, PanPath } from "../typings/interface/pan";

export default class Folder {
    folder: FolderJSON;
    constructor(json: string) {
        this.folder = JSON.parse(json);
    }

    json() {
        return JSON.stringify(this.folder);
    }

    findByPath(path: PanPath) {
        if (path == "/") return { target: this.folder, father: this.folder, index: undefined };

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
                result = targetIndex == -1 ? undefined : result.folders[targetIndex];
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

    create(path: PanPath, name: string, id?: string) {
        const folder: FolderJSON = {
            name,
            id: id ?? uuidV4(),
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
                father.folders?.splice(index!, 1);
                if (path_ == "/") {
                    // 如果是删除根目录 根目录不会被删除 要排除根目录的id
                    folderIds.shift();
                    delete this.folder.folders;
                }
            } else {
                errors.push(path_);
            }
        }

        return { folderIds, errors };
    }

    rename(path: PanPath, name: string) {
        const { target } = this.findByPath(path);
        target.name = name;
    }

    move(from: PanPath, to: PanPath) {
        const { target, father, index } = this.findByPath(from);
        if (father.folders?.length && index !== undefined) {
            const { target: to_ } = this.findByPath(to);
            to_?.folders?.length ? to_.folders.push(target) : (to_.folders = [target]);
            father.folders.splice(index, 1);
        }
    }

    static foreach(folder: FolderJSON, cb: (item: FolderJSON) => void) {
        cb(folder);
        if (folder.folders) {
            folder.folders.forEach((item) => this.foreach(item, cb));
        }
    }
}
