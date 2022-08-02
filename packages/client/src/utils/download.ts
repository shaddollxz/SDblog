import streamSaver from "streamsaver";

/** 下载字符串或文件类型 */
export function download(filename: string, content: Blob): void;
export function download(filename: string, content: string): void;
export function download(filename: string, content: string | Blob) {
    const a = document.createElement("a");
    const url = URL.createObjectURL(typeof content == "string" ? new Blob([content]) : content);
    a.href = url;
    a.download = filename;
    a.style.display = "none";
    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/** 通过fetchApi下载大文件 */
export async function downloadWithFetch(fileName: string, res: Response) {
    const size = +res.headers.get("content-length")!;
    const fileStream = streamSaver.createWriteStream(fileName, { size });
    res.body!.pipeTo(fileStream).then(() => {
        fileStream.close();
    });
    return { reader: res.body!.getReader(), size };
}
