import { Pan, User } from "../db";

const users = await User.find();

for (const user of users) {
    const userDoc = (await Pan.find({ user: user._id }))[0];
    if (!userDoc) {
        const doc = new Pan({ user: user._id, path: `{}` });
        await doc.save();
    }
}
