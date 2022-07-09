import typegoose from "@typegoose/typegoose";
const { prop, modelOptions, Severity } = typegoose;
import type { Ref } from "@typegoose/typegoose";
import { User } from "./user";
import type { DB } from "./DB";

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class Essay implements DB {
    declare DB: true;

    @prop({ required: true, ref: () => User })
    declare author: Ref<User>;

    @prop({ required: true })
    declare content: string;

    @prop({ default: 0 })
    declare likes: number;

    @prop({ default: [] })
    declare pictures: string[];

    @prop({ default: 0 })
    declare replyCount: number;

    @prop({ default: Date.now })
    declare createdAt: Date;
}
