export function filenameSlice(filename: string) {
    const arr = filename.split(".");
    return {
        prefix: arr.shift()!,
        suffix: arr.length ? `.${arr.join(".")}` : "",
        suffixArr: arr,
    };
}

export function formateFilename(filename: string, otherMsg?: Record<string, string>) {
    const { prefix, suffix } = filenameSlice(filename);
    let name = `${prefix}-T${Date.now()}`;
    if (otherMsg) {
        for (let key in otherMsg) {
            name += `--O${key}-${otherMsg[key]}E`;
        }
    }
    return name + suffix;
}

export function originalFilename(filename: string, isSuffix = true) {
    const { prefix: name, suffix } = filenameSlice(filename);

    if (isSuffix) {
        return name.replace(/(-T\d+)(--O[^-]+?-[^-]+?E)*/, "") + suffix;
    } else {
        return name.replace(/(-T\d+)(--O[^-]+?-[^-]+?E)*/, "");
    }
}

export function filenameMsg(filename: string): Record<"time" | string, string> {
    const { prefix: name } = filenameSlice(filename);
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
