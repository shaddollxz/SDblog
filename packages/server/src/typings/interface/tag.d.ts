import type { Tag } from "../../db/tag";
import type { SchemaToInfo } from "../tools/SchemaToInfo";

export type TagInfo = Omit<SchemaToInfo<Tag>, "creater">;

export type CreateTagOptions = Pick<TagInfo, "value">;

export {};
