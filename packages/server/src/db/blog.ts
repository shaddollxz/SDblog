import type { Ref } from "@typegoose/typegoose";
import typegoose, { defaultClasses } from "@typegoose/typegoose";
import type { DB } from "./DB";
import { Tag } from "./tag";
import { User } from "./user";
const { prop } = typegoose;

export class Blog extends defaultClasses.TimeStamps implements DB {
    declare DB: true;

    @prop({ required: true, type: () => String })
    declare title: string;

    @prop({ required: true, type: () => String })
    declare content: string;

    @prop({ required: true, ref: () => User })
    declare author: Ref<User>;

    @prop({ default: "", type: () => String })
    declare description: string;

    @prop({ default: null, type: () => String })
    declare headPic: string;

    @prop({ default: [], ref: () => Tag })
    declare tags: Ref<Tag>[];

    @prop({ default: 0, type: () => Number })
    declare read: number;

    @prop({ default: 0, type: () => Number })
    declare likes: number;

    @prop({ default: 0, type: () => Number })
    declare replyCount: number;
}
