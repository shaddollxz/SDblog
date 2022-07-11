import typegoose from "@typegoose/typegoose";
const { getModelForClass } = typegoose;

import { Blog as BlogSchema } from "./blog";
import { Essay as EssaySchema } from "./essay";
import { Pan as PanSchema } from "./pan";
import { PanFile as PanFileSchema } from "./panfile";
import { Reply as ReplySchema } from "./reply";
import { Tag as TagSchema } from "./tag";
import { TempFile as TempFileSchema } from "./tempfile";
import { User as UserSchema } from "./user";
import { Verifycode as VerifycodeSchema } from "./verifycode";

export const Blog = getModelForClass(BlogSchema);
export const Essay = getModelForClass(EssaySchema);
export const Pan = getModelForClass(PanSchema);
export const PanFile = getModelForClass(PanFileSchema);
export const Reply = getModelForClass(ReplySchema);
export const Tag = getModelForClass(TagSchema);
export const TempFile = getModelForClass(TempFileSchema);
export const User = getModelForClass(UserSchema);
export const Verifycode = getModelForClass(VerifycodeSchema);
