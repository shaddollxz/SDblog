export type Mutable<T> = { -readonly [key in keyof T]: T[key] };

export type DeepReadonly<T extends Object> = {
    readonly [K in keyof T]: T[K] extends Object ? DeepReadonly<T[K]> : T[K];
};
