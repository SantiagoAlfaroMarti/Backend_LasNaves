import { Request } from 'express';

export interface TokenDecoded {
    id: number,
    role: 'user' | 'admin';
    email: string
}

declare global {
    namespace Express {
        export interface Request {
            tokenData: TokenDecoded;
        }
    }
}