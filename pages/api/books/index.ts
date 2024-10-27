import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { verifyToken, isAdmin } from '../../../utils/auth'

const prisma = new PrismaClient()

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: API for managing books
 */

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Retrieve a list of books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: A list of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The book ID.
 *                   title:
 *                     type: string
 *                     description: The title of the book.
 *       500:
 *         description: Internal server error
 */
async function getBooks(req: NextApiRequest, res: NextApiResponse) {
    const books = await prisma.book.findMany()
    return res.status(200).json(books)
}

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the book.
 *                 example: "The Great Gatsby"
 *     responses:
 *       201:
 *         description: Book created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The created book ID.
 *                 title:
 *                   type: string
 *                   description: The title of the created book.
 *       400:
 *         description: Title is required.
 *       403:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error
 */
async function createBook(req: NextApiRequest, res: NextApiResponse) {
    const user = await verifyToken(req)
    if (!user || !isAdmin(user)) {
        return res.status(403).json({ message: 'Unauthorized' })
    }

    const { title } = req.body

    // Validate that title is provided
    if (!title) {
        return res.status(400).json({ message: 'Title is required' })
    }

    const book = await prisma.book.create({ data: { title } })
    return res.status(201).json(book)
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET':
            return getBooks(req, res)
        case 'POST':
            return createBook(req, res)
        default:
            return res.status(405).json({ message: 'Method not allowed' })
    }
}
