import fs from "fs-extra";
import path from "path";
import { pipeline } from "stream/promises";
import { filenameSlice } from "./formateFilename";
import { parallelPromise } from "./parallelPromise";

interface SliceFileOption {
    formateFilename?: (filename: { prefix: string; suffix: string }, index: number) => string;
    chunkSize?: number;
}
export async function sliceFile(filepath: string, targetpath: string, options: SliceFileOption = {}) {
    options = Object.assign({ chunkSize: +process.env.PUBLIC_UPLOAD_CHUNKSIZE }, options);
    const filename = path.basename(filepath);
    const { prefix, suffix } = filenameSlice(filename);
    const fileSize = (await fs.stat(filepath)).size;
    let start = 0,
        end = options.chunkSize!,
        index = 0,
        isBreak = false;

    while (end <= fileSize + options.chunkSize!) {
        if (end > fileSize) {
            end = fileSize;
            isBreak = true;
        }

        const readStream = fs.createReadStream(filepath, {
            start,
            end,
        });
        const writeStream = fs.createWriteStream(
            path.resolve(
                targetpath,
                options.formateFilename
                    ? options.formateFilename({ prefix, suffix }, index)
                    : `${prefix}_${index}${suffix}`
            )
        );
        await pipeline(readStream, writeStream);

        if (isBreak) break;
        index++;
        start = ++end;
        end += options.chunkSize!;
    }
}

interface ConcatFilesOption {
    chunkSize?: number;
    parallelMax?: number;
}
export async function concatFiles(paths: string[], target: string, options: ConcatFilesOption = {}) {
    options = Object.assign(
        {
            chunkSize: +process.env.PUBLIC_UPLOAD_CHUNKSIZE,
            parallelMax: 4,
        },
        options
    );
    await fs.createFile(target);
    const tasks = paths.map((filepath, index) => {
        const func = async () => {
            const readStream = fs.createReadStream(filepath);
            const writeStream = fs.createWriteStream(target, {
                start: index * options.chunkSize!,
                flags: "r+", // 从start的位置开始覆盖 因为parallelProise会无序地并发执行
            });
            await pipeline(readStream, writeStream);
            return index;
        };
        return {
            func: func,
            args: [],
        };
    });
    return await parallelPromise(tasks, options.parallelMax);
}
