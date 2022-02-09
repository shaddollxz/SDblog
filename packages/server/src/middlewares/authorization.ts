import { verify } from "../utils/jwt";
import { StatusEnum } from "#interface";

export function mustLogin(): MiddleWare {
    return async (req, res, next) => {
        let token = req.header("Authorization");
        if (!token) {
            return res.status(StatusEnum.Unauthorized).json({ error: "登录再进行操作", isShow: true });
        } else {
            try {
                token = token.replace(/^Bearer\s/, "");
                const { _id } = verify(token);
                req.body._id = _id;
                next();
            } catch (e) {
                res.status(StatusEnum.Unauthorized).json({
                    error: "登录过期，请重新登录",
                    isShow: true,
                    logout: true,
                });
            }
        }
    };
}

export function admin(): MiddleWare {
    return async (req, res, next) => {
        let token = req.header("Authorization");
        if (!token) {
            return res.status(StatusEnum.Unauthorized).json({ error: "登录再进行操作", isShow: true });
        } else {
            try {
                token = token.replace(/^Bearer\s/, "");
                const { isAdmin } = await verify(token);
                if (!isAdmin) {
                    res.status(StatusEnum.Unauthorized).json({ error: "权限不足", isShow: true });
                }
                next();
            } catch (e) {
                res.status(StatusEnum.Unauthorized).json({
                    error: "登录过期，请重新登录",
                    isShow: true,
                    logout: true,
                });
            }
        }
    };
}
