export default function () {
    const queryStr = document.location.search.replace("?", "");
    const query: Partial<Record<string, string | string[]>> = {};

    for (const keyValue of queryStr.split("&")) {
        const [_key, _value] = keyValue.split("=");
        const key = decodeURI(_key),
            value = decodeURI(_value);

        if (query[key]) {
            const data = query[key]!;
            if (Array.isArray(data)) {
                data.push(value);
            } else {
                query[key] = [data, value];
            }
        } else {
            query[key] = value;
        }
    }

    return query;
}
