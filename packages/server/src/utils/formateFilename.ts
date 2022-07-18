export function formateFilename(filename: string, otherMsg?: Record<string, string>) {
    const arr = filename.split(".");
    let name = `${arr.shift()}-T${Date.now()}`;
    if (otherMsg) {
        for (let key in otherMsg) {
            name += `--O${key}-${otherMsg[key]}E`;
        }
    }
    const suffix = arr.length ? `.${arr.join(".")}` : "";
    return name + suffix;
}

export function originalFilename(filename: string, isSuffix = true) {
    const arr = filename.split(".");
    let name = arr.shift()!;
    const suffix = arr.length ? "." + arr.join(".") : "";

    if (isSuffix) {
        return name.replace(/(-T\d+)(--O[^-]+?-[^-]+?E)*/, "") + suffix;
    } else {
        return name.replace(/(-T\d+)(--O[^-]+?-[^-]+?E)*/, "");
    }
}

export function filenameMsg(filename: string): Record<"time" | string, string> {
    const name = filename.split(".")![0];
    const time = name.match(/-T(\d+)/)![1];
    const msgs = name.split("--O");
    msgs.shift();
    const msgObj: Record<string, string> = {};
    for (const msg of msgs) {
        const [key, value] = msg.split("-");
        msgObj[key] = value.slice(0, -1);
    }

    return {
        time,
        ...msgObj,
    };
}
