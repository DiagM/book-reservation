import { NextApiRequest } from 'next';
import jwt from 'jsonwebtoken';
import { PrismaClient, User } from '@prisma/client'; // Make sure to import User type

const prisma = new PrismaClient();

export async function verifyToken(req: NextApiRequest): Promise<User | null> {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return null;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        return await prisma.user.findUnique({ where: { id: decoded.id } });
    } catch (error) {
        console.error("Token verification failed:", error); // Log the error for debugging
        return null;
    }
}

export function isAdmin(user: User | null): boolean {
    return user?.isAdmin ?? false; // Safely handle the case when user is null
}
