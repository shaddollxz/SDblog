import typegoose, { defaultClasses } from "@typegoose/typegoose";
const { prop } = typegoose;
import type { Ref } from "@typegoose/typegoose";
import { Pan } from "./pan";
import type { DB } from "./DB";

export class PanFile extends defaultClasses.TimeStamps implements DB {
    declare DB: true;

    @prop({ required: true, ref: () => Pan })
    declare belong: Ref<Pan>;

    @prop({ require: true })
    declare name: string;

    @prop({ require: true })
    declare size: string;

    @prop({ require: true })
    declare path: string;

    @prop({ require: true })
    declare filePath: string;

    @prop({ default: false })
    declare isPublic: boolean;

    @prop({ default: false, select: false })
    declare isDelete: boolean;
}
