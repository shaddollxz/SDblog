import type { ReturnModelType } from "@typegoose/typegoose";
import typegoose from "@typegoose/typegoose";
import FolderTool from "../utils/Folder";
import type { DB } from "./DB";
import { PanFile } from "./index";
const { prop } = typegoose;

export class Pan implements DB {
    declare DB: true;

    @prop({ required: true })
    declare _id: string;

    @prop({ required: true })
    declare path: string;

    static async findFolderWithFile(this: ReturnModelType<typeof Pan>, userId: string) {
        const folder = await this.findById(userId);
        if (folder) {
            const folderToll = new FolderTool(folder.path);
            const files = await PanFile.find({ belongId: folder._id });
            FolderTool.foreach(folderToll.folder, (item) => {
                item.files = files.filter((panfile) => {
                    return panfile.folderId == item.id;
                });
            });
            return { folderObj: folderToll.folder, _id: folder._id };
        } else {
            throw "未知错误";
        }
    }
}
