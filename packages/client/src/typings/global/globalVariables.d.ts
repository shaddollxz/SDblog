interface FormDataT<T extends Record<string, string | Blob | number>> {
    append(name: keyof T, value: T[typeof name], fileName?: string): void;
    delete(name: keyof T): void;
    get(name: keyof T): FormDataEntryValue | null;
    getAll(name: keyof T): FormDataEntryValue[];
    has(name: keyof T): boolean;
    set(name: keyof T, value: T[typeof name], fileName?: string): void;
    forEach(
        callbackfn: (value: FormDataEntryValue, key: keyof T, parent: FormData) => void,
        thisArg?: any
    ): void;
}
declare const FormDataT: {
    prototype: FormData<T>;
    new <T extends Record<string, string | Blob | number>>(form?: HTMLFormElement): FormDataT<T>;
};
