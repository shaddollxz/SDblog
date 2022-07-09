import typegoose from "@typegoose/typegoose";
const { prop } = typegoose;
import { DB } from "./DB";

export class Authority implements DB {
    declare DB: true;

    @prop({ default: true })
    declare reply: boolean;

    @prop({ default: false })
    declare blog: boolean;

    @prop({ default: false })
    declare pan: boolean;
}
