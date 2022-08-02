import AdmZip from "adm-zip";
import fs from "fs-extra";
import path from "path";
import type { Folder, PanPath } from "../typings/interface/pan";
import { fileHash } from "./fileHash";
import { default as FolderClass } from "./Folder";
//todo 需要把这些移进worker
/** 将指定文件全部压缩进一个包 */
export function zipFiles(files: { path: string; name: string }[]) {
    const zip = new AdmZip();

    for (const file of files) {
        zip.addLocalFile(file.path, "", file.name);
    }

    const outDir = path.resolve(process.env.TEMP_PATH, "tempZip" + Date.now());
    return new Promise<{ zipPath: string; hash: string }>((resolve, reject) => {
        zip.writeZip(outDir, async (e) => {
            if (e) {
                reject(e);
            }
            const hash = await fileHash(outDir);
            const finallyPath = path.resolve(process.env.TEMP_PATH, hash);
            if (await fs.pathExists(finallyPath)) {
                await fs.rename(outDir, finallyPath);
            } else {
                fs.rm(outDir);
            }
            resolve({ zipPath: finallyPath, hash });
        });
    });
}

/** 压缩文件夹 */
export function zipFolder(folder: Folder, folderPath: PanPath) {
    const folderClass = new FolderClass("{}");
    folderClass.folder = folder;
    const { target } = folderClass.findByPath(folderPath);
    let zip = new AdmZip();
    zip = zipTo(zip, "", target as unknown as Folder);

    const outDir = path.resolve(process.env.TEMP_PATH, "tempZip-" + Date.now());
    return new Promise<{ zipPath: string; hash: string }>((resolve, reject) => {
        zip.writeZip(outDir, async (e) => {
            if (e) {
                reject(e);
            }
            const hash = await fileHash(outDir);
            const finallyPath = path.resolve(process.env.TEMP_PATH, hash);
            if (await fs.pathExists(finallyPath)) {
                fs.rm(outDir);
            } else {
                await fs.rename(outDir, finallyPath);
            }
            resolve({ zipPath: finallyPath, hash });
        });
    });
}

function zipTo(zip: AdmZip, zipPath: string, folder: Folder) {
    if (folder.files) {
        for (const file of folder.files) {
            zip.addLocalFile(path.resolve(process.env.PAN_PATH, file.hash), zipPath, file.name);
        }
    }
    if (folder.folders) {
        for (const childFolder of folder.folders) {
            zip = zipTo(zip, zipPath + "/" + childFolder.name, childFolder);
        }
    }
    return zip;
}
