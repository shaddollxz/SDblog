import crypto from "crypto";

export default function (str: string) {
    return crypto
        .createHash("md5")
        .update("tou" + str + "jio")
        .digest("hex");
}
