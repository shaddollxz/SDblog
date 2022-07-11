import { Pan, User } from "../db";
import { v4 as uuidV4 } from "uuid";

const users = await User.find();

for (const user of users) {
    const userDoc = (await Pan.find({ user: user._id }))[0];
    if (!userDoc) {
        const doc = new Pan({ _id: user._id, path: `{"id":"${uuidV4()}"}` });
        await doc.save();
    }
}
