import typegoose from "@typegoose/typegoose";
const { prop } = typegoose;
import type { DB } from "./DB";

export class Verifycode implements DB {
    declare DB: true;

    @prop({ required: true })
    declare email: string;

    @prop({ required: true, unique: true })
    declare verifycode: string;

    @prop({ default: Date.now, index: { expireAfterSeconds: 600 } })
    declare createdAt: Date;
}
