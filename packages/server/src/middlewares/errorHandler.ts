import { format } from "util";
import type { ErrorRequestHandler } from "express";
import { StatusEnum } from "#interface";

export default (): ErrorRequestHandler => (err, req, res, next) => {
    console.error(`${Date.now()}
    ${err}
    `);
    res.status(StatusEnum.ServerError).json({
        error: format(err),
    });
};
