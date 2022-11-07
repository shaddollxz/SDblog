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
