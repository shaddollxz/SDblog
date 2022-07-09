export function formateFilename(filename: string) {
    const arr = filename.split(".");
    return `${arr.shift()}-T${Date.now()}.${arr.join(".")}`;
}

export function originalFilename(filename: string, isSuffix = true) {
    return isSuffix ? filename.replace(/-T\d+?\./, ".") : filename.replace(/-T\d+.*/, "");
}
