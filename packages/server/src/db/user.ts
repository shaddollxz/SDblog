import typegoose from "@typegoose/typegoose";
const { prop, defaultClasses } = typegoose;
import { AuthorityEnum } from "#interface";
import md5 from "../utils/md5";
import type { dbBase } from "./dbBase";

export class User extends defaultClasses.TimeStamps implements dbBase {
    declare DB: true;

    @prop({ required: true })
    declare name: string;

    @prop({ required: true, unique: true })
    declare email: string;

    @prop({ required: true, set: (pwd) => md5(pwd), select: false })
    declare passWord?: string;

    @prop({ default: null })
    declare avatar: string;

    @prop({ default: 0 })
    declare avatarFrame: number;

    @prop({ default: AuthorityEnum.normal })
    declare authority: AuthorityEnum;

    @prop({ default: false, select: false })
    declare isDelete?: boolean;
}
