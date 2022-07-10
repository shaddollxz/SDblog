import typegoose, { defaultClasses } from "@typegoose/typegoose";
const { prop } = typegoose;
import type { DocumentType } from "@typegoose/typegoose";
import type { DB } from "./DB";
import fs from "fs-extra";
import { resolve } from "path";
import { panPath } from "../utils/paths";
import type { PanPath } from "#interface";

export class PanFile extends defaultClasses.TimeStamps implements DB {
    declare DB: true;

    @prop({ required: true })
    declare belongId: string; // 文件所属的网盘id

    @prop({ require: true })
    declare name: string;

    @prop({ require: true })
    declare size: number;

    @prop({ require: true })
    declare path: PanPath;

    @prop({ require: true })
    declare filePath: string;

    @prop({ default: false })
    declare isPublic: boolean;

    @prop({ default: false, select: false })
    declare isDelete: boolean;

    async deleteFile(this: DocumentType<PanFile>) {
        this.isDelete = true;
        await this.save();
        setTimeout(() => {
            fs.remove(resolve(panPath, this.filePath));
        }, 0);
    }
}
