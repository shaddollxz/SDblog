import mongoose from "mongoose";
const { DBURL, DBNAME, DBPWD, DBUSER } = process.env;

try {
    await mongoose.connect(DBURL, {
        dbName: DBNAME,
        auth: { username: DBUSER, password: DBPWD },
        authSource: DBNAME,
    });
} catch {
    console.error("数据库链接失败");
    process.exit(1);
}
