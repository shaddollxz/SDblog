import mongoose from "mongoose";
const { DBURL, DBNAME } = process.env;

//? 连接数据库
mongoose.connect(DBURL + "/" + DBNAME);
const db = mongoose.connection;

db.on("error", () => {
    console.error("链接失败");
});
db.on("open", () => {
    console.log("链接成功");
});
