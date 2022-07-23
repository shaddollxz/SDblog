import type { ErrorRequestHandler } from "express";
import { format } from "util";
import { StatusEnum } from "../typings/enum";

export default (): ErrorRequestHandler => (err, req, res, next) => {
    console.error(`${Date.now()}
    ${err}
    `);
    res.status(StatusEnum.ServerError).json({
        error: format(err),
    });
};
