import axios from "axios";
import type { RecruitOptions, RecruitInfo, RecruitListItem } from "../typings/interface/arKnight";
import { successResponse, failResponse } from "../utils/createResponse";

export const recruit: GetHandler<RecruitOptions> = async (req, res, next) => {
    const url = "https://ak.hypergryph.com/user/api/inquiry/gacha";
    try {
        // 第一次请求
        const lastTs = req.query.lastTs;
        delete req.query.lastTs;
        const list = await getList();
        successResponse(res, { data: { list, pagination: { total: 233, current: 233 } } });

        async function getList(resultList: RecruitListItem[] = [], page = 1): Promise<RecruitListItem[]> {
            const { data } = (await axios.get(url, {
                params: { ...req.query, page },
            })) as { data: { data: RecruitInfo; code: number; msg: string } };
            if (data.code != 0 && data.msg) {
                throw data.msg;
            }
            const allPage = Math.ceil(data.data.pagination.total / 10);
            const list = data.data.list;
            const lastTsIndex = lastTs ? tsIndex(lastTs, list) : list.length;
            resultList.push(...data.data.list.slice(0, lastTsIndex));

            // 有多页且记录的最后一项没有在当前页里
            if (allPage > 1 && page < allPage && lastTsIndex == list.length) {
                return await getList(resultList, ++page);
            }

            return resultList;
        }
    } catch (e) {
        if (typeof e == "string") {
            failResponse(res, { code: 500, msg: e });
        } else {
            failResponse(res, { code: 500, msg: "转发鹰角接口失败" });
        }
    }

    function tsIndex(ts: number, list: RecruitListItem[]) {
        for (let i = 0; i < list.length; i++) {
            if (list[i].ts == ts) {
                return i;
            }
        }
        return list.length;
    }
};
