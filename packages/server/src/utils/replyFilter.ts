import type { DocumentType } from "@typegoose/typegoose";
import type { Reply } from "../db/reply";
import type { ReplyItemInfo, Author } from "#interface";

export default function (replys: DocumentType<Reply>[]): ReplyItemInfo[] {
    const result: ReplyItemInfo[] = [];
    const map = Object.create(null);
    replys.forEach((item) => {
        const data = item.toJSON() as unknown as ReplyItemInfo & { user?: Author; visitor?: Author };
        data.author = data.user ?? data.visitor!;
        delete data.user;
        delete data.visitor;
        if (data.replyTo) {
            map[data.replyTo].children.unshift(data);
        } else {
            data.children = [];
            map[data._id] = data;
            result.unshift(data);
        }
    });
    return result;
}
