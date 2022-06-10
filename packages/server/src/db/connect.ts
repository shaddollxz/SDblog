import mongoose from "mongoose";
const { DBURL } = process.env;

//? 连接数据库
mongoose.connect(DBURL);
const db = mongoose.connection;

db.on("error", () => {
    console.log("链接失败");
});
db.on("open", () => {
    console.log("链接成功");
});
