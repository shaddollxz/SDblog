import jwt from "jsonwebtoken";
const { jwtSecret, jwtLimit } = process.env;

interface UserPayload {
    _id: string;
    isAdmin: boolean;
}

export function sign(data: UserPayload) {
    return jwt.sign(data, jwtSecret!, { expiresIn: jwtLimit! });
}

export function verify(token: string) {
    return jwt.verify(token, jwtSecret!) as UserPayload;
}
