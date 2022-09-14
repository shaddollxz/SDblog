export function createFormData<T extends object>(data: T): FormDataT<T> {
    const form = new FormDataT();
    for (let key in data) {
        form.append(key, data[key]);
    }
    // @ts-ignore
    return form;
}
