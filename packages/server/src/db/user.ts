import typegoose from "@typegoose/typegoose";
const { prop, defaultClasses } = typegoose;
import { AuthorityEnum } from "#interface";
import md5 from "../utils/md5";
import type { dbBase } from "./dbBase";

export class User extends defaultClasses.TimeStamps implements dbBase {
    DB!: true;

    @prop({ required: true })
    name!: string;

    @prop({ required: true, unique: true })
    email!: string;

    @prop({ required: true, set: (pwd) => md5(pwd), select: false })
    passWord?: string;

    @prop({ default: null })
    avatar!: string;

    @prop({ default: 0 })
    avatarFrame!: number;

    @prop({ default: AuthorityEnum.normal })
    authority!: AuthorityEnum;

    @prop({ default: false, select: false })
    isDelete?: boolean;
}
