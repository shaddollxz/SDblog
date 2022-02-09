import typegoose from "@typegoose/typegoose";
const { prop, modelOptions, Severity } = typegoose;
import type { Ref, ReturnModelType } from "@typegoose/typegoose";
import { User } from "./user";
import { ReplyEnum } from "../typings/enum";
import replyFilter from "../utils/replyFilter";
import type { ReplyListInfo } from "#interface";
import type { dbBase } from "./dbBase";

export interface VisitorInfo {
    name: string;
    email: string;
}

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class Reply implements dbBase {
    DB!: true;

    @prop({ default: null, ref: () => User })
    user?: Ref<User>;

    @prop({ default: null })
    visitor?: VisitorInfo | null;

    @prop({ required: true })
    content!: string;

    @prop({ required: true })
    replyMainId!: string;

    @prop({ required: true })
    type!: ReplyEnum;

    @prop({ default: null })
    replyTo!: string;

    @prop({ default: 0 })
    likes!: number;

    @prop({ default: Date.now })
    createdAt!: Date;

    static async findReply(this: ReturnModelType<typeof Reply>, replyMainId: string) {
        const replyList = await this.find({ replyMainId }).sort({ createdAt: 1 }).populate("user");
        return {
            count: replyList.length,
            replyList: replyFilter(replyList),
        } as ReplyListInfo;
    }
}
