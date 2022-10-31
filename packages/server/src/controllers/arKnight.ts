import axios from "axios";
import type { RecruitOptions, RecruitInfo } from "../typings/interface/arKnight";
import { successResponse, failResponse } from "../utils/createResponse";

export const recruit: GetHandler<RecruitOptions> = async (req, res, next) => {
    try {
        const { data } = (await axios.get("https://ak.hypergryph.com/user/api/inquiry/gacha", {
            params: req.query,
        })) as { data: { data: RecruitInfo } };
        successResponse(res, { data: data.data });
    } catch (e) {
        failResponse(res, { code: 500, msg: "请求失败" });
    }
};
