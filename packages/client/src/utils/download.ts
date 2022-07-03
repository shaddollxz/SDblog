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
