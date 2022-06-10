declare module "process" {
    global {
        var process: NodeJS.Process;
        namespace NodeJS {
            interface ProcessEnv extends Dict<string> {
                readonly DBURL: string;
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
