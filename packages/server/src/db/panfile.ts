import typegoose, { defaultClasses } from "@typegoose/typegoose";
const { prop } = typegoose;
import type { DocumentType } from "@typegoose/typegoose";
import type { DB } from "./DB";
import { TempFile } from "./index";
import fs from "fs-extra";
import { resolve } from "path";
import type { PanPath } from "#interface";

export class PanFile extends defaultClasses.TimeStamps implements DB {
    declare DB: true;

    @prop({ required: true })
    declare belongId: string; // 文件所属的网盘id

    @prop({ required: true })
    declare hash: string; // 文件内容唯一性的hash

    @prop({ require: true })
    declare name: string;

    @prop({ require: true })
    declare size: number;

    @prop({ require: true })
    declare folderId: string;

    @prop({ require: true })
    declare filePath: string;

    @prop({ default: false })
    declare isPublic: boolean;

    async deleteFile(this: DocumentType<PanFile>) {
        await this.delete();
        const temp = new TempFile(this);
        await temp.save();

        setTimeout(() => {
            fs.move(resolve(process.env.PAN_PATH, this.filePath), process.env.TEMP_PATH);
        }, 0);
    }
}
