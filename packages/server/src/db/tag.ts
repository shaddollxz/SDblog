import typegoose from "@typegoose/typegoose";
const { prop } = typegoose;
import type { Ref } from "@typegoose/typegoose";
import { User } from "./user";
import type { dbBase } from "./dbBase";

export class Tag implements dbBase {
    DB!: true;

    @prop({ required: true, unique: true })
    value!: string;

    @prop({ required: true, ref: () => User })
    creater!: Ref<User>;
}
