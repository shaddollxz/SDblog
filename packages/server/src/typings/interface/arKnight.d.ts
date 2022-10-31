export interface RecruitOptions {
    page: number;
    token: string;
    channelId: number;
}

interface RecruitListItem {
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
