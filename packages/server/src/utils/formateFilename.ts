export function filenameSlice(filename: string) {
    const arr = filename.split(".");
    return {
        prefix: arr.shift()!,
        suffix: arr.length ? `.${arr.join(".")}` : "",
        suffixArr: arr,
    };
}

export function formateFilename<T extends object>(filename: string, msg: T) {
    const { prefix, suffix } = filenameSlice(filename);

    let name = prefix;
    for (let key in msg) {
        name += `--O${key}-${msg[key]}E`;
    }

    return name + suffix;
}

export function originalFilename(filename: string, isSuffix = true) {
    const { prefix: name, suffix } = filenameSlice(filename);

    if (isSuffix) {
        return name.replace(/(--O[^-]+?-[^-]+?E)+/, "") + suffix;
    } else {
        return name.replace(/(--O[^-]+?-[^-]+?E)+/, "");
    }
}

export function filenameMsg<T extends object>(filename: string): T {
    const { prefix: name } = filenameSlice(filename);
    const msgs = name.split("--O");
    msgs.shift();
    const msgObj = {};
    for (const msg of msgs) {
        const [key, value] = msg.split("-");
        msgObj[key] = value.slice(0, -1);
    }

    return msgObj as T;
}
