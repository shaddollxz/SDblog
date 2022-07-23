import AdmZip from "adm-zip";
import fs from "fs-extra";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { fileHash } from "./fileHash";
import { formateFilename, originalFilename } from "./formateFilename";

export function zipFiles(files: { path: string; name: string }[], outname?: string) {
    const zip = new AdmZip();

    for (const file of files) {
        zip.addLocalFile(file.path, "", file.name);
    }

    const outDir = path.resolve(process.env.TEMP_PATH, uuidv4() + ".zip");
    return new Promise<string>((resolve, reject) => {
        zip.writeZip(outDir, async (e) => {
            if (e) {
                reject(e);
            }
            const finallyPath = path.resolve(process.env.TEMP_PATH, (await fileHash(outDir)) + ".zip");
            if (await fs.pathExists(finallyPath)) {
                await fs.rename(outDir, finallyPath);
            }
            resolve(finallyPath);
        });
    });
}

/**
 * @deprecated
 * 压缩文件夹
 */
export function zipFolder(folderPath: string, extraFiles?: string[], outname?: string) {
    const folderName = path.basename(folderPath);
    const outDir = path.resolve(process.env.TEMP_PATH, formateFilename(outname || folderName + ".zip"));

    const zip = new AdmZip();

    zip.addLocalFolder(folderPath, folderName + "/");
    if (extraFiles) {
        for (const fileDir of extraFiles) {
            zip.addLocalFile(fileDir, "", originalFilename(path.basename(fileDir)));
        }
    }

    return new Promise((resolve, reject) => {
        zip.writeZip(outDir, (e) => {
            if (e) {
                reject(e);
            }
            resolve(outDir);
        });
    });
}
