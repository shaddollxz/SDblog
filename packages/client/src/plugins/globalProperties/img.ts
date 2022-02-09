import { randomPicApi } from "@apis";

import akarin from "@img/avatar/default.jpg";
import admin from "@img/avatar/admin.png";
import blogCard from "@img/blogHeadPic_default.png";

const avatarFrame: string[] = [];
const frames = import.meta.globEager("../../assets/img/frame/*.png");
for (const key in frames) {
    avatarFrame.push(frames[key].default as string);
}

export default {
    akarin,
    admin,
    blogCard,
    avatarFrame,
    randomPic: async function () {
        const { data } = await randomPicApi();
        return data?.imgSrc || this.blogCard;
    },
};
