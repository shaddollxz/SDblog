import typegoose from "@typegoose/typegoose";
import type { DB } from "./DB";
const { prop } = typegoose;

export class TempFile implements DB {
    declare DB: true;

    @prop({ required: true, type: () => String })
    declare hash: string;

    @prop({ required: true, type: () => String })
    declare filePath: string;

    @prop({
        default: Date.now,
        index: { expireAfterSeconds: +process.env.PUBLIC_TEMP_DAY! },
        type: () => Number,
    })
    declare createdAt: Date;
}
