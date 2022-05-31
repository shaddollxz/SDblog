import typegoose from "@typegoose/typegoose";
const { prop } = typegoose;
import type { Ref } from "@typegoose/typegoose";
import { User } from "./user";
import type { dbBase } from "./dbBase";

export class Tag implements dbBase {
    declare DB: true;

    @prop({ required: true, unique: true })
    declare value: string;

    @prop({ required: true, ref: () => User })
    declare creater: Ref<User>;
}
