// import streamSaver from "streamsaver";
import { Message } from "sdt3";

/** 下载字符串或文件类型 */
export function download(filename: string, content: Blob): void;
export function download(filename: string, content: string): void;
export function download(filename: string, content: string | Blob) {
    const url = URL.createObjectURL(typeof content == "string" ? new Blob([content]) : content);
    downloadWithUrl(filename, url);
    URL.revokeObjectURL(url);
}

/** 通过url下载服务器文件 */
export function downloadWithUrl(filename: string, url: string) {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

/** 通过fetchApi下载大文件 */
// export async function downloadWithFetch(fileName: string, res: Response) {
//     if (res.body) {
//         const readableStream = res.body!;
//         const size = +res.headers.get("content-length")!;
//         const fileStream = streamSaver.createWriteStream(fileName, { size });
//         if (window.WritableStream && readableStream.pipeTo) {
//             await readableStream.pipeTo(fileStream);
//             return { size };
//         } else {
//             const writer = fileStream.getWriter();
//             const reader = res.body.getReader();
//             await pump();
//             return { size };

//             async function pump() {
//                 const readerRes = await reader.read();
//                 if (readerRes.done) {
//                     writer.close();
//                 } else {
//                     await writer.write(readerRes.value);
//                     pump();
//                 }
//             }
//         }
//     } else {
//         Message.error("文件下载失败");
//         throw "";
//     }
// }
