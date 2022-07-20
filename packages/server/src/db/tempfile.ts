import typegoose, { defaultClasses } from "@typegoose/typegoose";
const { prop } = typegoose;
import { DB } from "./DB";

export class TempFile implements DB {
    declare DB: true;

    @prop({ required: true })
    declare hash: string;

    @prop({ required: true })
    declare filePath: string;

    @prop({ default: Date.now, index: { expireAfterSeconds: +process.env.PUBLIC_TEMP_DAY! } })
    declare createdAt: Date;
}
