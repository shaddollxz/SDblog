declare module "process" {
    global {
        var process: NodeJS.Process;
        namespace NodeJS {
            interface ProcessEnv extends Dict<string> {
                // 开发模式
                readonly MODE: "development" | "production";
                // 公共变量
                readonly PUBLIC_DIST_PATH: string;
                readonly PUBLIC_STATIC_PATH: string;
                readonly PUBLIC_STATIC_PREFIX: string;
                readonly PUBLIC_TEMP_DAY: NumberString;
                readonly PUBLIC_UPLOAD_CHUNKSIZE: NumberString;
                // 私有变量
                readonly DBURL: string;
                readonly DBNAME: string;
                readonly JWT_SECRET: string;
                readonly JWT_LIMIT: string;
                readonly EMAIL: string;
                readonly EMAIL_SECRET: string;
                readonly PAN_PATH: string;
                readonly TEMP_PATH: string;
                readonly ARCHIVE_LEVE: NumberString;
                readonly blogPageCount: NumberString;
                readonly essayPageCount: NumberString;
                readonly PORT: string;
            }
        }
    }
}
