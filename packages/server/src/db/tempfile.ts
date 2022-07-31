import typegoose from "@typegoose/typegoose";
import type { DB } from "./DB";
import { User } from "./user";
const { prop } = typegoose;

export class TempFile implements DB {
    declare DB: true;

    @prop({ required: true, type: () => String })
    declare hash: string;

    @prop({ required: true, type: () => String })
    declare fileName: string; // 文件的实际文件名 为hash值加上额外信息 会储存chunkIndex等信息

    @prop({ ref: () => User })
    declare user?: User; // 如果有该字段 文件则在用户的回收站中

    @prop({ type: () => String })
    declare name?: string; // 如果是用户回收站的文件 有一个name属性

    @prop({
        default: Date.now,
        index: { expireAfterSeconds: +process.env.PUBLIC_TEMP_DAY! },
        type: () => Number,
    })
    declare createdAt: Date;
}
