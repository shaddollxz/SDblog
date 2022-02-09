import Validator from "../utils/Validator";
import { StatusEnum } from "#interface";
import type { RegisterOptions } from "#interface";

export const register: PostHandler<RegisterOptions> = (req, res, next) => {
    try {
        const { name, email, passWord } = req.body;
        new Validator(name).notEmpty().errorMsg("用户名不能为空").check();
        new Validator(email).notEmpty().errorMsg("邮箱不能为空").isEmail().check();
        new Validator(passWord)
            .notEmpty()
            .errorMsg("密码不能为空")
            .minLength(5)
            .errorMsg("密码长度不能小于5")
            .check();
        next();
    } catch (e) {
        res.status(StatusEnum.Forbidden).json({
            // @ts-ignore
            error: e.errorMsg[0],
            isShow: true,
        });
    }
};
