import type { ReturnModelType } from "@typegoose/typegoose";
import typegoose from "@typegoose/typegoose";
import FolderTool from "../utils/Folder";
import type { DB } from "./DB";
import { PanFileDB } from "./index";
const { prop } = typegoose;

export class Pan implements DB {
    declare DB: true;

    @prop({ required: true, type: () => String })
    declare _id: string;

    @prop({ required: true, type: () => String })
    declare path: string;

    static async findFolderWithFile(this: ReturnModelType<typeof Pan>, userId: string) {
        const folder = await this.findById(userId);
        if (folder) {
            const folderToll = new FolderTool(folder.path);
            const files = (await PanFileDB.find({ belongId: folder._id })).map((item) => item.toJSON());
            FolderTool.foreach(folderToll.folder, (item) => {
                // @ts-ignore
                item.files = files.filter((panfile) => panfile.folderId == item.id);
            });
            return { folderObj: folderToll.folder, _id: folder._id };
        } else {
            throw "未知错误";
        }
    }
}
