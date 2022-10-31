export interface RecruitOptions {
    page: number;
    token: string;
    channelId: number;
}

interface RecruitListItem {
    ts: number; // 唯一标识符 不是时间戳
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
