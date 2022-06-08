import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const staticPath = path.resolve(__dirname, "../../../../static");
export const publicPath = path.resolve(__dirname, "../../../../public");
