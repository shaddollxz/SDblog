import typegoose from "@typegoose/typegoose";
const { prop, defaultClasses } = typegoose;
import type { Ref } from "@typegoose/typegoose";
import { User } from "./user";
import { Tag } from "./tag";
import type { dbBase } from "./dbBase";

export class Blog extends defaultClasses.TimeStamps implements dbBase {
    DB!: true;

    @prop({ required: true })
    title!: string;

    @prop({ required: true })
    content?: string;

    @prop({ required: true, ref: () => User })
    author!: Ref<User>;

    @prop({ default: "" })
    description!: string;

    @prop({ default: null })
    headPic!: string;

    @prop({ default: [], ref: () => Tag })
    tags!: Ref<Tag>[];

    @prop({ default: 0 })
    read!: number;

    @prop({ default: 0 })
    likes!: number;

    @prop({ default: 0 })
    replyCount!: number;
}
