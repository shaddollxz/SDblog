import { StatusEnum, AuthorityEnum } from "../typings/enum";
import { verify } from "../utils/jwt";
import { authorityCheck, addAuthority } from "../utils/authority";

export const analyzeToken: MiddleWare = async (req, res, next) => {
    let token = req.header("Authorization");
    if (!token) {
        return res.status(StatusEnum.Unauthorized).json({ error: "登录后再进行操作", isShow: true });
    } else {
        try {
            token = token.replace(/^Bearer\s/, "");
            const { _id, authority } = verify(token);
            req.body._id = _id;
            req.body.authority = authority;
            return next();
        } catch (e) {
            res.status(StatusEnum.Unauthorized).json({
                error: "登录过期，请重新登录",
                isShow: true,
                logout: true,
            });
        }
    }
};

export function haveAuthority(...authority: AuthorityEnum[]): MiddleWare {
    return async function (req, res, next) {
        try {
            if (req.body.authority) {
                const result = authorityCheck(req.body.authority, addAuthority(0, ...authority));
                if (result) {
                    return next();
                } else {
                    res.status(StatusEnum.Unauthorized).json({ isShow: true, error: "权限不足" });
                }
            }
        } catch (e) {
            res.status(StatusEnum.Unauthorized).json({ isShow: true, error: "权限验证失败" });
        }
    };
}
