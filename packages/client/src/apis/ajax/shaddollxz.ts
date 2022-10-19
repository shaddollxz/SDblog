import axios from "../axios";
import type { ShaddollxzInfo } from "@blog/server";

export default function () {
    return axios<ShaddollxzInfo>({
        method: "get",
        url: "shaddollxz",
    });
}
