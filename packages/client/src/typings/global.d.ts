declare type DeepReadonly<T extends Object> = {
    readonly [K in keyof T]: T[K] extends Object ? DeepReadonly<T[K]> : T[K];
};

declare type NumberString = `${number}`;

declare type Mutable<T> = { -readonly [key in keyof T]: T[key] };

declare type Ref<T> = import("vue").Ref<T>;
declare type App = import("vue").App;
