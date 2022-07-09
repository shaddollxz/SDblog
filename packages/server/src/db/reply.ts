import typegoose from "@typegoose/typegoose";
const { prop, modelOptions, Severity } = typegoose;
import type { Ref, ReturnModelType } from "@typegoose/typegoose";
import { User } from "./user";
import { ReplyEnum } from "../typings/enum";
import replyFilter from "../utils/replyFilter";
import type { ReplyListInfo } from "#interface";
import type { DB } from "./DB";

export interface VisitorInfo {
    name: string;
    email: string;
}

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class Reply implements DB {
    declare DB: true;

    @prop({ default: null, ref: () => User })
    declare user?: Ref<User>;

    @prop({ default: null })
    declare visitor?: VisitorInfo | null;

    @prop({ required: true })
    declare content: string;

    @prop({ required: true })
    declare replyMainId: string;

    @prop({ required: true })
    declare type: ReplyEnum;

    @prop({ default: null })
    declare replyTo: string;

    @prop({ default: 0 })
    declare likes: number;

    @prop({ default: Date.now })
    declare createdAt: Date;

    static async findReply(this: ReturnModelType<typeof Reply>, replyMainId: string) {
        const replyList = await this.find({ replyMainId }).sort({ createdAt: 1 }).populate("user");
        return {
            count: replyList.length,
            replyList: replyFilter(replyList),
        } as ReplyListInfo;
    }
}
