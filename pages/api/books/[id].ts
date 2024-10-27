import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { verifyToken, isAdmin } from '../../../utils/auth';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    const { id } = req.query;

    switch (method) {
        case 'GET':
            return getBook(req, res, id);
        case 'DELETE':
            return deleteBook(req, res, id);
        default:
            return res.status(405).json({ message: 'Method not allowed' });
    }
}

async function getBook(req: NextApiRequest, res: NextApiResponse, id: string | string[]) {
    if (!id || Array.isArray(id)) {
        return res.status(400).json({ message: 'Invalid ID' });
    }

    const bookId = parseInt(id as string, 10); // Convert id to integer

    try {
        const book = await prisma.book.findUnique({
            where: { id: bookId },
        });

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        return res.status(200).json(book); // Return book details
    } catch (error) {
        console.error("Error fetching book:", error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

async function deleteBook(req: NextApiRequest, res: NextApiResponse, id: string | string[]) {
    try {
        const user = await verifyToken(req);
        if (!user || !isAdmin(user)) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        if (!id || Array.isArray(id)) {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        const bookId = parseInt(id as string, 10); // Convert id to integer

        const book = await prisma.book.findUnique({ where: { id: bookId } });
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Delete related records first (example: reviews)
        await prisma.reservation.deleteMany({ where: { bookId: bookId } });

        // Now delete the book
        await prisma.book.delete({ where: { id: bookId } });

        return res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        console.error("Error deleting book:", error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

