import akarin from "@img/avatar/default.jpg";
import admin from "@img/avatar/admin.png";

const avatarFrame: string[] = [];
const frames = import.meta.glob<{ default: string }>("../../assets/img/frame/*.png", { eager: true });
for (const key in frames) {
    avatarFrame.push(frames[key].default);
}

export default {
    akarin,
    admin,
    avatarFrame,
};
