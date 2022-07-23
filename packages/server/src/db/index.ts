import typegoose from "@typegoose/typegoose";
const { getModelForClass } = typegoose;

import { Blog } from "./blog";
import { Essay } from "./essay";
import { Pan } from "./pan";
import { PanFile } from "./panfile";
import { Reply } from "./reply";
import { Tag } from "./tag";
import { TempFile } from "./tempfile";
import { User } from "./user";
import { Verifycode } from "./verifycode";

export const BlogDB = getModelForClass(Blog);
export const EssayDB = getModelForClass(Essay);
export const PanDB = getModelForClass(Pan);
export const PanFileDB = getModelForClass(PanFile);
export const ReplyDB = getModelForClass(Reply);
export const TagDB = getModelForClass(Tag);
export const TempFileDB = getModelForClass(TempFile);
export const UserDB = getModelForClass(User);
export const VerifycodeDB = getModelForClass(Verifycode);
