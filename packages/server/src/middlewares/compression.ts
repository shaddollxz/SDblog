import compression from "compression";

export default compression({ filter: shouldCompress });

function shouldCompress(req, res) {
    if (req.headers["x-no-compression"]) {
        // 这里就过滤掉了请求头包含'x-no-compression'
        return false;
    }
    return compression.filter(req, res);
}
