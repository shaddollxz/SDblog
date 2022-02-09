import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const avatarupload = multer({ dest: path.join(__dirname, "../../static/avatar") });
export const avatar = avatarupload.single("avatar");

const imageupload = multer({ dest: path.join(__dirname, "../../static/image") });
export const image = imageupload.single("image");
