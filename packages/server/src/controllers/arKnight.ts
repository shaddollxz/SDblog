import axios from "axios";
import type { RecruitOptions, RecruitInfo, RecruitListItem } from "../typings/interface/arKnight";
import { successResponse, failResponse } from "../utils/createResponse";

export const recruit: GetHandler<RecruitOptions> = async (req, res, next) => {
    try {
        const url = "https://ak.hypergryph.com/user/api/inquiry/gacha";
        // 第一次请求
        const lastTs = req.query.lastTs;
        delete req.query.lastTs;
        const { data } = (await axios.get(url, {
            params: { ...req.query, page: 1 },
        })) as { data: { data: RecruitInfo } };
        // 如果有新数据且有多页 后端拼接多个请求
        const allPage = Math.ceil(data.data.pagination.total / 10);
        if (!lastTs || (lastTs != data.data.list[0].ts && allPage > 1)) {
            console.log("find all");
            const list: RecruitListItem[] = data.data.list;
            for (let i = 2; i < allPage; i++) {
                const { data: data_onePage } = (await axios.get(url, {
                    params: { ...req.query, page: i },
                })) as { data: { data: RecruitInfo } };
                list.push(...data_onePage.data.list);
            }
            successResponse(res, { data: { list, pagination: data.data.pagination } });
        } else {
            successResponse(res, { data: data.data });
        }
    } catch (e) {
        failResponse(res, { code: 500, msg: "请求失败" });
    }
};
