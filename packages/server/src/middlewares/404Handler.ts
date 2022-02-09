import { StatusEnum } from "#interface";
export default function (): MiddleWare {
    return (req, res, next) => {
        res.status(StatusEnum.notFound).json({
            error: "not found",
        });
    };
}
