import jwt from "jsonwebtoken";
const { JWT_SECRET, JWT_LIMIT } = process.env;

interface UserPayload {
    _id: string;
    authority: number;
}

export function sign(data: UserPayload) {
    return jwt.sign(data, JWT_SECRET, { expiresIn: JWT_LIMIT });
}

export function verify(token: string) {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
}
