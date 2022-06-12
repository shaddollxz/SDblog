import { LocalStorage } from "sdt3";

interface Theme {
    themeColor: string;
    theme: "dark" | "light";
}

export default new LocalStorage<Theme>();
