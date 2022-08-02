import type { DocumentType } from "@typegoose/typegoose";
import typegoose, { defaultClasses } from "@typegoose/typegoose";
import fs from "fs-extra";
import path from "path";
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

    async deleteFile(this: DocumentType<PanFile>, _id: string) {
        await this.delete();
        const isOtherFile = await PanFileDB.findOne({ hash: this.hash });
        if (!isOtherFile) {
            const temp = new TempFileDB({
                hash: this.hash,
                fileName: this.hash,
                user: _id,
                name: this.name,
            });
            await temp.save();

            setTimeout(async () => {
                const oriPath = path.resolve(process.env.PAN_PATH!, this.hash);
                const targetPath = path.resolve(process.env.TEMP_PATH!, this.hash);
                try {
                    await fs.access(targetPath);
                    await fs.rm(oriPath);
                } catch {
                    fs.move(oriPath, targetPath);
                }
            }, 0);
        }
    }
}
