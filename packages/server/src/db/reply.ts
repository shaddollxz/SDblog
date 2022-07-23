import type { Ref, ReturnModelType } from "@typegoose/typegoose";
import typegoose from "@typegoose/typegoose";
import { ReplyEnum } from "../typings/enum";
import type { ReplyListInfo } from "../typings/interface/reply";
import replyFilter from "../utils/replyFilter";
import type { DB } from "./DB";
import { User } from "./user";
const { prop, modelOptions, Severity } = typegoose;

export interface VisitorInfo {
    name: string;
    email: string;
}

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class Reply implements DB {
    declare DB: true;

    @prop({ default: null, ref: () => User })
    declare user?: Ref<User>;

    @prop({ default: null, type: () => Number })
    declare visitor?: VisitorInfo;

    @prop({ required: true, type: () => String })
    declare content: string;

    @prop({ required: true, type: () => String })
    declare replyMainId: string;

    @prop({ required: true, type: () => Number })
    declare type: ReplyEnum;

    @prop({ default: null, type: () => String })
    declare replyTo: string;

    @prop({ default: 0, type: () => Number })
    declare likes: number;

    @prop({ default: Date.now, type: () => Number })
    declare createdAt: Date;

    static async findReply(this: ReturnModelType<typeof Reply>, replyMainId: string) {
        const replyList = await this.find({ replyMainId }).sort({ createdAt: 1 }).populate("user");
        return {
            count: replyList.length,
            replyList: replyFilter(replyList),
        } as ReplyListInfo;
    }
}
