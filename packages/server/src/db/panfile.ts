import type { DocumentType } from "@typegoose/typegoose";
import typegoose, { defaultClasses } from "@typegoose/typegoose";
import fs from "fs-extra";
import type { ObjectId } from "mongoose";
import { resolve } from "path";
import type { DB } from "./DB";
import { TempFileDB } from "./index";
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
    declare filePath: string;

    async deleteFile(this: DocumentType<PanFile>) {
        await this.delete();
        const temp = new TempFileDB(this);
        await temp.save();

        setTimeout(() => {
            fs.move(resolve(process.env.PAN_PATH!, this.filePath), process.env.TEMP_PATH!);
        }, 0);
    }
}
