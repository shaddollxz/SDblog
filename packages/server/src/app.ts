import "./typings/global"; // 全局类型
import "./utils/loadEnv"; // 加载环境变量
import "./db/connect"; // 链接数据库
import express from "express";
import compression from "./middlewares/compression";
import { publicPath, staticPath } from "@blog/scripts";

const app = express();

app.use(compression); //gzip
app.use(express.json());

// 配置静态资源
app.use("/", express.static(publicPath)); // 网页
app.use("/assets", express.static(staticPath)); // 上传的资源

// 配置接口
import routes from "./routes";
app.use(routes);

// 404和错误处理
import notFound from "./middlewares/404Handler";
import error from "./middlewares/errorHandler";
app.use(notFound, error);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("server is run at http://localhost:" + PORT));
