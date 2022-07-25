import "vue";

export interface Img {
    akarin: string;
    admin: string;
    avatarFrame: string[];
}
export interface FormatNumber {
    (number: number, precision?: number, isSlice?: boolean): string;
}
export interface FormatTime {
    (timeStr: number | string | Date, formatStr: string, isUseChinese?: boolean): string;
}
export interface FormatBit {
    (size: number, precision?: number): string;
}

declare module "vue" {
    export interface ComponentCustomProperties {
        $img: Img;
        $formatNumber: FormatNumber;
        $formatTime: FormatTime;
        $formatBit: FormatBit;
    }
}
