import typegoose, { defaultClasses } from "@typegoose/typegoose";
import { AuthorityEnum } from "../typings/enum";
import md5 from "../utils/md5";
import type { DB } from "./DB";
const { prop } = typegoose;

/** 用户权限 */
interface Authority {
    reply: boolean;
    blog: boolean;
    pan: boolean;
}

export class User extends defaultClasses.TimeStamps implements DB {
    declare DB: true;

    @prop({ required: true, type: () => String })
    declare name: string;

    @prop({ required: true, unique: true, type: () => String })
    declare email: string;

    @prop({ required: true, set: (pwd) => md5(pwd), select: false, type: () => String })
    declare passWord?: string;

    @prop({ default: null, type: () => String })
    declare avatar: string;

    @prop({ default: 0, type: () => Number })
    declare avatarFrame: number;

    @prop({ default: AuthorityEnum.normal, type: () => Number })
    declare authority: AuthorityEnum;

    @prop({ default: false, select: false, type: () => Boolean })
    declare isDelete?: boolean;
}
