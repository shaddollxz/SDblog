import "./typings/global"; // 全局类型
import "./utils/loadEnv"; // 加载环境变量
import "./db/connect";
import express from "express";
import compression from "./middlewares/compression";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(compression); //gzip
app.use(express.json());

// 配置静态资源
app.use("/", express.static(path.join(__dirname, "../public"))); // 网页
app.use("/assets", express.static(path.join(__dirname, "../static"))); // 上传的资源

// 配置接口
import routes from "./routes";
app.use(routes);

// 404和错误处理
import notFound from "./middlewares/404Handler";
import error from "./middlewares/errorHandler";
app.use(notFound, error);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("server is run at http://localhost:" + PORT));

import "./db/connect";
