import jwt from "jsonwebtoken";
let jwtSecret = process.env.jwtSecret!;

interface UserPayload {
    _id: string;
    isAdmin: boolean;
}

export function sign(data: UserPayload, limit: number | string) {
    return jwt.sign(data, jwtSecret, { expiresIn: limit });
}

export function verify(token: string) {
    return jwt.verify(token, jwtSecret) as UserPayload;
}
