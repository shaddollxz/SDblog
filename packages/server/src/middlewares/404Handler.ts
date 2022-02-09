import { StatusEnum } from "#interface";

const notFound: MiddleWare = (req, res, next) => {
    res.status(StatusEnum.notFound).json({
        error: "not found",
    });
};

export default notFound;
