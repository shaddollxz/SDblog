export interface RecruitOptions {
    lastTs?: number;
    token: string;
    channelId: number;
}

export interface RecruitListItem {
    ts: number; // 时间戳 乘以1000后为正常时间
    pool: string;
    chars: { name: string; rarity: number; isNew: boolean }[];
}

export interface RecruitInfo {
    list: RecruitListItem[];
    pagination: {
        current: number;
        total: number;
    };
}
