import typegoose from "@typegoose/typegoose";
const { prop, defaultClasses } = typegoose;
import type { Ref } from "@typegoose/typegoose";
import { User } from "./user";
import { Tag } from "./tag";
import type { dbBase } from "./dbBase";

export class Blog extends defaultClasses.TimeStamps implements dbBase {
    declare DB: true;

    @prop({ required: true })
    declare title: string;

    @prop({ required: true })
    declare content: string;

    @prop({ required: true, ref: () => User })
    declare author: Ref<User>;

    @prop({ default: "" })
    declare description: string;

    @prop({ default: null })
    declare headPic: string;

    @prop({ default: [], ref: () => Tag })
    declare tags: Ref<Tag>[];

    @prop({ default: 0 })
    declare read: number;

    @prop({ default: 0 })
    declare likes: number;

    @prop({ default: 0 })
    declare replyCount: number;
}
