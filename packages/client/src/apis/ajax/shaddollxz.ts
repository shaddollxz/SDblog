import axios from "../axios";
import type { AxiosPromise } from "axios";
import type { ShaddollxzInfo } from "@blog/server";

export default function (): AxiosPromise<ShaddollxzInfo> {
    return axios({
        method: "get",
        url: "shaddollxz",
    });
}
