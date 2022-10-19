import type { ErrorRequestHandler } from "express";
import { format } from "util";
import { StatusEnum } from "../typings/enum";
import { failResponse } from "../utils/createResponse";

export default (): ErrorRequestHandler => (err, req, res, next) => {
    console.error(`${Date.now()}
    ${err}
    `);
    failResponse(res, { code: StatusEnum.ServerError, msg: "服务器内部错误", data: { error: format(err) } });
};
