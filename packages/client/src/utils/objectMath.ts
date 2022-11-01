export function objectAdd(...objects: object[]) {
    const result: Record<string, number> = {};
    for (const obj of objects) {
        for (let key in obj) {
            if (typeof +obj[key] == "number") {
                if (result[key]) {
                    result[key] += +obj[key];
                } else {
                    result[key] = +obj[key];
                }
            }
        }
    }
    return result;
}
