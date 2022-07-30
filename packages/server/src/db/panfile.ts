import type { DocumentType } from "@typegoose/typegoose";
import typegoose, { defaultClasses } from "@typegoose/typegoose";
import fs from "fs-extra";
import path, { resolve } from "path";
import type { DB } from "./DB";
import { PanFileDB, TempFileDB } from "./index";
const { prop } = typegoose;

export class PanFile extends defaultClasses.TimeStamps implements DB {
    declare DB: true;

    @prop({ required: true, type: () => String })
    declare hash: string;

    @prop({ required: true, type: () => String })
    declare belongId: string; // 文件所属的网盘id

    @prop({ require: true, type: () => String })
    declare name: string;

    @prop({ require: true, type: () => Number })
    declare size: number;

    @prop({ require: true, type: () => String })
    declare folderId: string;

    @prop({ require: true, type: () => String })
    declare fileName: string; // 储存的是文件名 且不带后缀

    async deleteFile(this: DocumentType<PanFile>, _id: string) {
        await this.delete();
        const isOtherFile = (await PanFileDB.find({ hash: this.hash })).length;
        if (!isOtherFile) {
            const targetPath = path.resolve(process.env.TEMP_PATH!, this.hash);
            const temp = new TempFileDB({
                user: _id,
                hash: this.hash,
                name: this.name,
                fileName: this.hash,
            });
            await temp.save();

            setTimeout(() => {
                fs.move(resolve(process.env.PAN_PATH!, this.fileName), process.env.TEMP_PATH!);
            }, 0);
        }
    }
}
