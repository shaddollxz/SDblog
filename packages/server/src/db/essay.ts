import type { Ref } from "@typegoose/typegoose";
import typegoose from "@typegoose/typegoose";
import type { DB } from "./DB";
import { User } from "./user";
const { prop, modelOptions, Severity } = typegoose;

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class Essay implements DB {
    declare DB: true;

    @prop({ required: true, ref: () => User })
    declare author: Ref<User>;

    @prop({ required: true, type: () => String })
    declare content: string;

    @prop({ default: 0, type: () => Number })
    declare likes: number;

    @prop({ default: [], type: () => [String] })
    declare pictures: string[];

    @prop({ default: 0, type: () => Number })
    declare replyCount: number;

    @prop({ default: Date.now, type: () => Number })
    declare createdAt: Date;
}
