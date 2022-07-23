import type { Ref } from "@typegoose/typegoose";
import typegoose from "@typegoose/typegoose";
import type { DB } from "./DB";
import { User } from "./user";
const { prop } = typegoose;

export class Tag implements DB {
    declare DB: true;

    @prop({ required: true, unique: true, type: () => String })
    declare value: string;

    @prop({ required: true, ref: () => User })
    declare creater: Ref<User>;
}
