import axios from "axios";
import type { RecruitOptions, RecruitInfo } from "../typings/interface/arKnight";
import { successResponse, failResponse } from "../utils/createResponse";

export const recruit: GetHandler<RecruitOptions> = async (req, res, next) => {
    try {
        // const { data } = (await axios.get("https://ak.hypergryph.com/user/api/inquiry/gacha", {
        //     params: req.query,
        // })) as { data: { data: RecruitInfo } };
        // successResponse(res, { data: data.data });
        successResponse(res, {
            data: {
                list: [
                    {
                        ts: 1665481304,
                        pool: "轴承与火星",
                        chars: [
                            {
                                name: "蛇屠箱",
                                rarity: 3,
                                isNew: false,
                            },
                            {
                                name: "杰西卡",
                                rarity: 3,
                                isNew: false,
                            },
                            {
                                name: "玫兰莎",
                                rarity: 2,
                                isNew: false,
                            },
                            {
                                name: "守林人",
                                rarity: 4,
                                isNew: false,
                            },
                            {
                                name: "格雷伊",
                                rarity: 3,
                                isNew: false,
                            },
                            {
                                name: "霜叶",
                                rarity: 3,
                                isNew: false,
                            },
                            {
                                name: "清道夫",
                                rarity: 3,
                                isNew: false,
                            },
                            {
                                name: "地灵",
                                rarity: 3,
                                isNew: false,
                            },
                            {
                                name: "铅踝",
                                rarity: 3,
                                isNew: false,
                            },
                            {
                                name: "炎熔",
                                rarity: 2,
                                isNew: false,
                            },
                        ],
                    },
                    {
                        ts: 1665476758,
                        pool: "轴承与火星aa",
                        chars: [
                            {
                                name: "孑",
                                rarity: 3,
                                isNew: false,
                            },
                            {
                                name: "月见夜",
                                rarity: 2,
                                isNew: false,
                            },
                            {
                                name: "炎熔",
                                rarity: 2,
                                isNew: false,
                            },
                            {
                                name: "铅踝",
                                rarity: 3,
                                isNew: true,
                            },
                            {
                                name: "深靛",
                                rarity: 3,
                                isNew: false,
                            },
                            {
                                name: "梓兰",
                                rarity: 2,
                                isNew: false,
                            },
                            {
                                name: "史都华德",
                                rarity: 2,
                                isNew: false,
                            },
                            {
                                name: "香草",
                                rarity: 2,
                                isNew: false,
                            },
                            {
                                name: "桑葚",
                                rarity: 4,
                                isNew: false,
                            },
                            {
                                name: "调香师",
                                rarity: 3,
                                isNew: false,
                            },
                        ],
                    },
                    {
                        ts: 1665476419,
                        pool: "轴承与火星aa",
                        chars: [
                            {
                                name: "崖心",
                                rarity: 4,
                                isNew: false,
                            },
                        ],
                    },
                    {
                        ts: 1665476412,
                        pool: "轴承与火星",
                        chars: [
                            {
                                name: "泡普卡",
                                rarity: 2,
                                isNew: false,
                            },
                        ],
                    },
                    {
                        ts: 1665476405,
                        pool: "轴承与火星",
                        chars: [
                            {
                                name: "霜叶",
                                rarity: 3,
                                isNew: false,
                            },
                        ],
                    },
                ],
                pagination: {
                    current: 1,
                    total: 5,
                },
            },
        });
    } catch (e) {
        failResponse(res, { code: 500, msg: "请求失败" });
    }
};
