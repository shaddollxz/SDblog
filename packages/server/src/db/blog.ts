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

    @prop({ required: true, default: "" })
    description!: string;

    @prop({ required: true, default: null })
    headPic!: string;

    @prop({ required: true, ref: () => Tag })
    tags!: Ref<Tag>[];

    @prop({ required: true, default: 0 })
    read!: number;

    @prop({ required: true, default: 0 })
    likes!: number;

    @prop({ required: true, default: 0 })
    replyCount!: number;
}
