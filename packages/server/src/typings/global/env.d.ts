declare module "process" {
    global {
        var process: NodeJS.Process;
        namespace NodeJS {
            interface ProcessEnv extends Dict<string> {
                // 开发模式
                readonly MODE: string;
                // 公共变量
                readonly PUBLIC_DIST_PATH: string;
                readonly PUBLIC_STATIC_PATH: string;
                readonly PUBLIC_PAN_PATH: string;
                // 私有变量
                readonly DBURL: string;
                readonly DBNAME: string;
                readonly JWT_SECRET: string;
                readonly JWT_LIMIT: string;
                readonly EMAIL: string;
                readonly EMAIL_SECRET: string;
                readonly blogPageCount: NumberString;
                readonly essayPageCount: NumberString;
                readonly PORT: string;
            }
        }
    }
}
