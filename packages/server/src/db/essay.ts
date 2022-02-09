import typegoose from "@typegoose/typegoose";
const { prop, modelOptions, Severity } = typegoose;
import type { Ref } from "@typegoose/typegoose";
import { User } from "./user";
import type { dbBase } from "./dbBase";

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class Essay implements dbBase {
    DB!: true;

    @prop({ required: true, ref: () => User })
    author!: Ref<User>;

    @prop({ required: true })
    content!: string;

    @prop({ default: 0 })
    likes!: number;

    @prop({ default: [] })
    pictures!: string[];

    @prop({ default: 0 })
    replyCount!: number;

    @prop({ default: Date.now })
    createdAt!: Date;
}
