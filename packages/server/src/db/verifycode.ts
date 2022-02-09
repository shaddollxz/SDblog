import typegoose from "@typegoose/typegoose";
const { prop } = typegoose;
import type { dbBase } from "./dbBase";

export class Verifycode implements dbBase {
    DB!: true;

    @prop({ required: true })
    email!: string;

    @prop({ required: true, unique: true })
    verifycode!: string;

    @prop({ default: Date.now, index: { expireAfterSeconds: 600 } })
    createdAt!: Date;
}
