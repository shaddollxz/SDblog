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

    // 如果文件和前端解析的hash值不同，这里是空的
    @prop({ type: () => String })
    declare belongId: string; // 文件所属的网盘id 和用户的id一样

    @prop({ require: true, type: () => String })
    declare name: string;

    @prop({ require: true, type: () => Number })
    declare size: number;

    @prop({ require: true, type: () => String })
    declare folderId: string; // 文件所属文件夹id

    @prop({ default: "", maxlength: 30, type: () => String })
    declare desciption: string;

    async deleteFile(this: DocumentType<PanFile>, _id: string) {
        await this.delete();
        // 如果文件已经被物理删除 这里就只删除数据库数据
        const oriPath = path.resolve(process.env.PAN_PATH!, this.hash);
        if (await fs.pathExists(oriPath)) {
            // 是否有其它用户储存了该文件 有的话就只删除数据库里的这条数据
            const isOtherFile = await PanFileDB.findOne({ hash: this.hash });
            if (!isOtherFile) {
                // 没有的话 将文件移动到回收站
                const temp = new TempFileDB({
                    hash: this.hash,
                    fileName: this.hash,
                    user: _id,
                    name: this.name,
                });
                await temp.save();

                setTimeout(async () => {
                    const targetPath = path.resolve(process.env.TEMP_PATH!, this.hash);
                    if (await fs.pathExists(targetPath)) {
                        await fs.rm(oriPath);
                    } else {
                        fs.move(oriPath, targetPath);
                    }
                }, 0);
            }
        }
    }
}
