import dotenv from "dotenv";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: resolve(__dirname, "../../../../env/.env") });

if (process.env.MODE == "development") {
    dotenv.config({ path: resolve(__dirname, "../../../../env/.env.development") });
}
