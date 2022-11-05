import { LocalStorage } from "sdt3";

export interface AKStorageInterface {
    userData: {
        ak_token: string;
        channelId: number;
    };
    lastTs: number;
    lastSixData: {
        lastSix: number;
        lastSix_limit: Record<string, number>;
    }; // 只记录普通池和最后一个限定池的差六星记录
}

export const AKStorage = new LocalStorage<AKStorageInterface>();
