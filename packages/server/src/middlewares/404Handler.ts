import { StatusEnum } from "../typings/enum";

const notFound: MiddleWare = (req, res, next) => {
    res.status(StatusEnum.NotFound).json({
        error: "not found",
    });
};

export default notFound;
