import typegoose from "@typegoose/typegoose";
const { prop } = typegoose;
import type { Ref, ReturnModelType, DocumentType } from "@typegoose/typegoose";
import { User } from "./user";
import type { DB } from "./DB";
import { PanFile } from "./index";
import type { FolderJson } from "#interface";

export class Pan implements DB {
    declare DB: true;

    @prop({ required: true, ref: () => User })
    declare user: Ref<User>;

    @prop({ required: true })
    declare path: string;

    static async findByUser(this: ReturnModelType<typeof Pan>, userId: string) {
        const doc = (await this.find({ user: userId }))[0];
        if (!doc) {
            throw "用户没有网盘";
        } else {
            return doc;
        }
    }

    static async findFolderWithFile(this: ReturnModelType<typeof Pan>, userId: string) {
        const folder = (await this.find({ user: userId }))[0];
        if (folder) {
            const folderObj = JSON.parse(folder.path) as FolderJson;
            const files = await PanFile.find({ belongId: folder._id });
            for (const file of files) {
                const target = file.path
                    .split("/")
                    .reduce((pre, cur, index) => (index ? pre : pre[cur]), folderObj);
                if (target.files) {
                    target.files.push({
                        size: file.size,
                        filePath: file.filePath,
                    });
                } else {
                    target.files = [
                        {
                            size: file.size,
                            filePath: file.filePath,
                        },
                    ];
                }
            }
            return { folderObj, _id: folder._id };
        } else {
            throw "未知错误";
        }
    }
}
