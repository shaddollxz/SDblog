import { StatusEnum } from "../typings/enum";
import { failResponse } from "../utils/createResponse";

const notFound: MiddleWare = (req, res, next) => {
    failResponse(res, { code: StatusEnum.NotFound, msg: "not found" });
};

export default notFound;
