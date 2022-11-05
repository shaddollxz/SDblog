import axios from "../axios";
import type { RecruitOptions, RecruitInfo } from "@blog/server";

export function recruit(params: RecruitOptions) {
    return axios<RecruitInfo>({
        url: "/arKnights/recruit",
        method: "get",
        params,
    });
}
