import type { Ref } from "@typegoose/typegoose";
import type { dbBase } from "../../db/dbBase";

export type ChangeProperties<T extends object, K extends keyof T, N> = {
    [Key in keyof T]: Key extends K ? N : T[Key];
};

type NotSend = "passWord" | "isDelete" | "creater" | "DB";

export type SchemaToInfo<T> = ChangeProperties<
    T extends dbBase
        ? {
              [K in keyof T as K extends NotSend ? never : K]: T[K] extends Ref<infer R>[]
                  ? SchemaToInfo<R>[]
                  : T[K] extends Ref<infer RR>
                  ? SchemaToInfo<RR>
                  : T[K] extends Function
                  ? never
                  : T[K];
          } & {
              _id: string;
          }
        : T,
    "createdAt" | "updatedAt",
    Date
>;
