import { PanDB, UserDB } from "../db";
import { v4 as uuidV4 } from "uuid";

const users = await UserDB.find();

for (const user of users) {
    const userDoc = (await PanDB.find({ user: user._id }))[0];
    if (!userDoc) {
        const doc = new PanDB({ _id: user._id, path: `{"id":"${uuidV4()}"}` });
        await doc.save();
    }
}
