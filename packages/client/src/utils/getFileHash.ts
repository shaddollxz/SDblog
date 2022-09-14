import SparkMD5 from "spark-md5";
import { filenameSlice } from "@blog/server";

/** 获得文件的唯一hash */
export function getFileHash(buffers: ArrayBuffer[]) {
    const spark = new SparkMD5.ArrayBuffer();
    for (const buffer of buffers) {
        spark.append(buffer);
    }
    return spark.end();
}

export async function formateFilenameToHash(file: File) {
    const fileBuffer = await file.arrayBuffer();
    const suffix = filenameSlice(file.name).suffix;
    // @ts-ignore
    file = null;
    const hash = getFileHash([fileBuffer]);
    return new File([fileBuffer], hash + suffix);
}
