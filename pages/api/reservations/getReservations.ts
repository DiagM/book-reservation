// /pages/api/getReservations.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const userId = req.query.userId;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }

        try {
            const reservations = await prisma.reservation.findMany({
                where: { userId: Number(userId) },
                include: {
                    book: true, // Inclut les détails du livre
                },
            });

            return res.status(200).json(reservations);
        } catch (error) {
            console.error("Error fetching reservations:", error);
            return res.status(500).json({ message: "Internal server error." });
        }
    }

    return res.status(405).json({ message: "Method not allowed." });
}
