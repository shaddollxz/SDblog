import type { DocumentType } from "@typegoose/typegoose";
import typegoose, { defaultClasses } from "@typegoose/typegoose";
import fs from "fs-extra";
import { resolve } from "path";
import type { DB } from "./DB";
import { TempFile } from "./index";
const { prop } = typegoose;

export class PanFile extends defaultClasses.TimeStamps implements DB {
    declare DB: true;

    @prop({ required: true })
    declare _id: string; // 使用文件hash作为id

    @prop({ required: true })
    declare belongId: string; // 文件所属的网盘id

    @prop({ require: true })
    declare name: string;

    @prop({ require: true })
    declare size: number;

    @prop({ require: true })
    declare folderId: string;

    @prop({ require: true })
    declare filePath: string;

    async deleteFile(this: DocumentType<PanFile>) {
        await this.delete();
        const temp = new TempFile(this);
        await temp.save();

        setTimeout(() => {
            fs.move(resolve(process.env.PAN_PATH!, this.filePath), process.env.TEMP_PATH!);
        }, 0);
    }
}
