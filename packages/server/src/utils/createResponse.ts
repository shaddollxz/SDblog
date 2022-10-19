import type { Response } from "express";
import { StatusEnum } from "../typings/enum";

interface ErrorData<T> {
    code: StatusEnum;
    msg?: string;
    data?: T;
}

export function successResponse<T = any>(res: Response, data?: Partial<ErrorData<T>>) {
    if (data) {
        // @ts-ignore
        data.data ??= {};
        data.code ??= StatusEnum.OK;
        data.msg ??= "";
        return res.status(StatusEnum.OK).json(data);
    } else {
        return res.status(StatusEnum.OK).json({ code: StatusEnum.OK, data: {}, msg: "" });
    }
}

export function failResponse<T = any>(res: Response, data: ErrorData<T>, code?: number) {
    // @ts-ignore
    data.data ??= {};
    data.msg ??= "";
    return res.status(code ?? data.code).json(data);
}
