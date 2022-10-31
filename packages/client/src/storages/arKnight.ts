import { LocalStorage } from "sdt3";

interface AKStorageInterface {
    ak_token: string;
}

export const AKStorage = new LocalStorage<AKStorageInterface>();
