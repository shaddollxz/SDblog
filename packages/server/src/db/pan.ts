import typegoose from "@typegoose/typegoose";
const { prop } = typegoose;
import type { Ref, ReturnModelType } from "@typegoose/typegoose";
import { User } from "./user";
import type { DB } from "./DB";
import { PanFile } from "./index";

export class Pan implements DB {
    declare DB: true;

    @prop({ required: true, ref: () => User })
    declare user: Ref<User>;

    @prop({ required: true })
    declare path: string;

    static async findFolderWithFile(this: ReturnModelType<typeof Pan>, userId: string) {
        const folder = (await this.find({ user: userId }))[0];
        if (folder) {
            const folderObj = JSON.parse(folder.path);
            const files = await PanFile.find({ belongId: folder._id });
            for (const file of files) {
                file.path.split("/").reduce((pre, cur) => pre[cur], folderObj);
            }
            return JSON.stringify(folderObj);
        } else {
            throw "未知错误";
        }
    }
}
