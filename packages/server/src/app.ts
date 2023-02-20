import "./utils/loadEnv"; // 加载环境变量
import "./db/connect"; // 链接数据库
import "./workers"; // 加载其它线程
import express from "express";
import compression from "./middlewares/compression";
import chalk from "chalk";

const app = express();

app.use(compression); //gzip
app.use(express.json({ limit: process.env.PUBLIC_UPLOAD_CHUNKSIZE + 1024 * 2 })); // 限制请求体最大为 chunkSize+2KB

// 配置静态资源
app.use("/", express.static(process.env.PUBLIC_DIST_PATH)); // 网页
app.use(process.env.PUBLIC_STATIC_PREFIX, express.static(process.env.PUBLIC_STATIC_PATH)); // 其它资源

// 配置接口
import routes from "./routes";
app.use(routes);

// 404和错误处理
import notFound from "./middlewares/404Handler";
import error from "./middlewares/errorHandler";
app.use(notFound, error);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server is run at ${chalk.blue(`http://localhost:${PORT}`)} `));
