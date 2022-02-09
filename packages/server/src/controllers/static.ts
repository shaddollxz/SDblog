import formatMedia from "../utils/formatMedia";
import { StatusEnum } from "#interface";

export const image: PostHandler = async (req, res, next) => {
    try {
        const imgName = await formatMedia(req.file);
        res.status(StatusEnum.OK).json({
            imgSrc: "/assets/image/" + imgName,
        });
    } catch (e) {
        next(e);
    }
};

export const avatar: PostHandler = async (req, res, next) => {
    try {
        const imgName = await formatMedia(req.file);
        res.status(StatusEnum.OK).json({
            imgSrc: "/assets/avatar/" + imgName,
        });
    } catch (e) {
        next(e);
    }
};

export const randomPic: PostHandler = async (req, res, next) => {
    try {
        // const { data } = await axios.get("https://api.ixiaowai.cn/api/api.php?return=json");
        // res.status(StatusEnum.OK).json({ imgurl: data.imgurl });
        res.status(StatusEnum.OK).json({ imgSrc: "" });
    } catch (e) {
        next(e);
    }
};
