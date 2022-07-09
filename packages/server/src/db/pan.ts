import typegoose from "@typegoose/typegoose";
const { prop } = typegoose;
import type { Ref } from "@typegoose/typegoose";
import { User } from "./user";
import type { DB } from "./DB";

export class Pan implements DB {
    declare DB: true;

    @prop({ required: true, ref: () => User })
    declare user: Ref<User>;

    @prop({ required: true })
    declare path: string;
}
