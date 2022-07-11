import AdmZip from "adm-zip";
import path from "path";
import { formateFilename, originalFilename } from "./formateFilename";

/** 压缩文件夹 */
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
