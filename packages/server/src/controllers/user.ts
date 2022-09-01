import { UserDB, VerifycodeDB, PanDB } from "../db";
import { AuthorityEnum, StatusEnum, VerifycodeEnum } from "../typings/enum";
import type {
    GetVerifycodeOptions,
    LoginOptions,
    RegisterOptions,
    RetrieveOptions,
    UserInfo,
    EnableAuthority,
    DisableAuthority,
} from "../typings/interface/user";
import { sign } from "../utils/jwt";
import md5 from "../utils/md5";
import sendEmail from "../utils/sendMail";
import { addAuthority, subAuthority } from "../utils/authority";
import { v4 as uuid } from "uuid";

/** 登录 */
export const login: PostHandler<LoginOptions> = async (req, res, next) => {
    try {
        let user = await UserDB.findOne({ email: req.body.email, isDelete: false }).select({
            name: 1,
            email: 1,
            passWord: 1,
            avatar: 1,
            avatarFrame: 1,
            authority: 1,
        });

        if (user) {
            if (user.passWord == md5(req.body.passWord)) {
                const token = sign({ _id: user._id, authority: user.authority });
                const userInfo = user.toJSON();
                delete userInfo.passWord;
                return res.status(StatusEnum.OK).json({ userData: userInfo, token });
            }
            throw "密码不正确";
        }
        throw "邮箱不正确";
    } catch (e) {
        res.status(StatusEnum.Forbidden).json({ error: e, isShow: true });
    }
};

/** 发送验证码 */
export const getVerifycode: GetHandler<GetVerifycodeOptions> = async (req, res, next) => {
    try {
        const email = req.query.email;
        const userData = await UserDB.findOne({ email, isDelete: false });
        switch (req.query.model) {
            case VerifycodeEnum.register:
                if (userData)
                    return res.status(StatusEnum.Forbidden).json({ error: "邮箱已注册", isShow: true });
                break;
            case VerifycodeEnum.retrieve:
                if (!userData)
                    return res.status(StatusEnum.Forbidden).json({ error: "没有该用户", isShow: true });
                break;
        }

        const randomCode = await sendEmail(email);
        const verifycode = new VerifycodeDB({ email, verifycode: randomCode });
        await verifycode.save();

        res.status(StatusEnum.OK).json({ success: true });
    } catch (e) {
        next(e);
    }
};

/** 检验验证码并注册 */
export const register: PostHandler<RegisterOptions> = async (req, res, next) => {
    try {
        const data = await VerifycodeDB.findOne({ verifycode: req.body.verifycode });
        const email = data?.email;
        if (email == req.body.email) {
            delete req.body._id;
            delete req.body.authority;
            await new UserDB({ ...req.body }).save();
            res.status(StatusEnum.OK).json({ success: true });
        } else {
            res.status(StatusEnum.Forbidden).json({ error: "验证码不正确", isShow: true });
        }
    } catch (e) {
        res.status(StatusEnum.Forbidden).json({ error: "邮箱已注册", isShow: true });
    }
};

/** 重新登录 */
export const relogin: GetHandler = async (req, res, next) => {
    try {
        const userData = await UserDB.findById(req.body._id);
        if (userData) {
            const token = sign({ _id: userData._id, authority: userData.authority });
            res.status(StatusEnum.OK).json({ userData, token });
        } else {
            res.status(StatusEnum.NotFound).json({ error: "没有该用户", isShow: true });
        }
    } catch (e) {
        next(e);
    }
};

/** 获取用户信息 */
export const userDetail: GetHandler<any, { userId: string }> = async (req, res, next) => {
    try {
        const userData = await UserDB.findById(req.params.userId);
        if (userData) {
            res.status(StatusEnum.OK).json({ ...userData.toJSON() });
        } else {
            res.status(StatusEnum.NotFound).json({ error: "没有该用户", isShow: true });
        }
    } catch (e) {
        next(e);
    }
};

/** 修改用户信息 */
export const updateUserInfo: PutHandler<UserInfo> = async (req, res, next) => {
    try {
        const userData = await UserDB.findByIdAndUpdate(
            req.body._id,
            { $set: { ...req.body } },
            { new: true }
        );
        res.status(StatusEnum.OK).json({ userData });
    } catch (e) {
        next(e);
    }
};

/** 修改密码 */
export const retrieve: PutHandler<RetrieveOptions> = async (req, res, next) => {
    try {
        const { newPassWord, verifycode } = req.body;
        const data = await VerifycodeDB.findOne({ verifycode });
        if (data) {
            const email = data.email;
            if (email == req.body.email) {
                const user = await UserDB.findOneAndUpdate(
                    { email },
                    { $set: { passWord: newPassWord } },
                    { new: true }
                );
                const token = sign({ _id: user!._id, authority: user!.authority });
                return res.status(StatusEnum.OK).json({ userData: user, token });
            } else {
                res.status(StatusEnum.Forbidden).json({ error: "验证码不正确", isShow: true });
            }
        } else {
            res.status(StatusEnum.Forbidden).json({ error: "验证码错误或失效", isShow: true });
        }
    } catch (e) {
        next(e);
    }
};

/** 添加或删除权限 */
export const enableAuthority: PutHandler<EnableAuthority> = async (req, res, next) => {
    try {
        const { userId, auth } = req.body;
        const user = await UserDB.findById(userId);
        if (user) {
            switch (auth) {
                case AuthorityEnum.pan_private: {
                    if (!(await PanDB.findById(userId)))
                        await new PanDB({ _id: user._id, path: `{"id":"${uuid()}","name":"root"}` }).save();
                    break;
                }
            }
            const authority = addAuthority(user.authority, auth);
            user.authority = authority;
            await user.save();
            res.status(StatusEnum.OK).json({ success: true });
        } else {
            res.status(StatusEnum.NotFound).json({ error: "没有该用户", isShow: true });
        }
    } catch (e) {
        next(e);
    }
};
export const disableAuthority: PutHandler<DisableAuthority> = async (req, res, next) => {
    try {
        const { userId, auth } = req.body;
        const user = await UserDB.findById(userId);
        if (user) {
            const authority = subAuthority(user.authority, auth);
            user.authority = authority;
            await user.save();
            res.status(StatusEnum.OK).json({ success: true });
        } else {
            res.status(StatusEnum.NotFound).json({ error: "没有该用户", isShow: true });
        }
    } catch (e) {
        next(e);
    }
};
