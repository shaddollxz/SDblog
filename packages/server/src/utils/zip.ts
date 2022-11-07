import AdmZip from "adm-zip";
import fs from "fs-extra";
import path from "path";
import type { Folder, PanPath } from "../typings/interface/pan";
import { fileHash } from "./fileHash";
import { default as FolderClass } from "./Folder";
import { panFileRealPath, tempFileRealPath } from "./assetsPath";

interface ZipOptions {
    files?: { hash: string; name: string }[];
    folder?: Folder;
    folderPaths?: PanPath[];
}

/**
 * 压缩文件和文件夹
 * 文件和文件夹全部在根目录
 */
export function zipFilesAndFolders({ files, folder, folderPaths }: ZipOptions) {
    let zip = new AdmZip();

    if (files) {
        for (const file of files) {
            zip.addLocalFile(path.resolve(panFileRealPath, file.hash), "", file.name);
        }
    }
    if (folder && folderPaths) {
        const folderClass = new FolderClass("{}");
        folderClass.folder = folder;
        for (const folderPath of folderPaths) {
            const { target } = folderClass.findByPath(folderPath);
            zip = zipTo(zip, "", target as unknown as Folder);
        }
    }

    return new Promise<{ zipPath: string; hash: string }>((resolve, reject) => {
        const outDir = path.resolve(tempFileRealPath, "tempZip" + Date.now());
        zip.writeZip(outDir, async (e) => {
            if (e) return reject(e);

            const hash = await fileHash(outDir);
            const finallyPath = path.resolve(tempFileRealPath, hash);
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
            zip.addLocalFile(path.resolve(panFileRealPath, file.hash), zipPath, file.name);
        }
    }
    if (folder.folders) {
        for (const childFolder of folder.folders) {
            zip = zipTo(zip, zipPath + "/" + childFolder.name, childFolder);
        }
    }
    return zip;
}
