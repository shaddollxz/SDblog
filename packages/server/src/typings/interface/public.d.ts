export interface Success {
    success: true;
}

export interface Faild extends Success {
    success?: false;
    error: string;
    isShow?: boolean;
}

// 博客和随笔和回复的作者
export interface Author {
    _id?: string;
    name: string;
    email: string;
    avatar?: string;
    avatarFrame: number;
}

export interface UploadAvatarOption {
    avatar: Blob;
}
export interface UploadImageOption {
    image: Blob;
}

export {};
