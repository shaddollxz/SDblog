import typegoose from "@typegoose/typegoose";
const { prop } = typegoose;
import type { dbBase } from "./dbBase";

export class Verifycode implements dbBase {
    declare DB: true;

    @prop({ required: true })
    declare email: string;

    @prop({ required: true, unique: true })
    declare verifycode: string;

    @prop({ default: Date.now, index: { expireAfterSeconds: 600 } })
    declare createdAt: Date;
}
