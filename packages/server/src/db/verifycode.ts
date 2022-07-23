import typegoose from "@typegoose/typegoose";
import type { DB } from "./DB";
const { prop } = typegoose;

export class Verifycode implements DB {
    declare DB: true;

    @prop({ required: true, type: () => String })
    declare email: string;

    @prop({ required: true, unique: true, type: () => String })
    declare verifycode: string;

    @prop({ default: Date.now, index: { expireAfterSeconds: 600 }, type: () => Number })
    declare createdAt: Date;
}
