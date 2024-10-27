// pages/api/reservations.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../../../utils/auth'; // Adjust the import path based on your project structure

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    switch (method) {
        case 'GET':
            return getReservations(req, res);
        case 'POST':
            return createReservation(req, res);
        case 'DELETE':
            return deleteReservation(req, res);
        default:
            return res.status(405).json({ message: 'Method not allowed' });
    }
}

async function getReservations(req: NextApiRequest, res: NextApiResponse) {
    const { userId, bookId } = req.query;

    if (!userId || !bookId) {
        return res.status(400).json({ message: 'User ID and Book ID are required' });
    }

    try {
        // Fetch reservations for the user and the specific book
        const reservations = await prisma.reservation.findMany({
            where: {
                userId: Number(userId), // Convert userId to a number
                bookId: Number(bookId), // Convert bookId to a number
            },
        });

        return res.status(200).json(reservations); // Return the reservations found
    } catch (error) {
        console.error("Error fetching reservations:", error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

async function createReservation(req: NextApiRequest, res: NextApiResponse) {
    const { userId, bookId, startDate, endDate } = req.body; // Destructure data from the request body

    if (!userId || !bookId || !startDate || !endDate) {
        return res.status(400).json({ message: 'User ID, Book ID, Start Date, and End Date are required' });
    }

    // Check if the end date is after the start date
    if (new Date(endDate) <= new Date(startDate)) {
        console.error("End date must be after the start date.");
        return res.status(400).json({ message: 'End date must be after the start date' });
    }

    try {
        // Verify the user token (if needed)
        const user = await verifyToken(req); // Assuming this function checks if the user is logged in

        if (!user) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Check the number of reservations the user already has
        const userReservationsCount = await prisma.reservation.count({
            where: { userId: Number(userId) },
        });

        // Enforce a limit of 3 reservations per user
        if (userReservationsCount >= 3) {
            console.error("User has reached the maximum number of reservations.");
            return res.status(400).json({ message: 'You have already reached the maximum number of reservations allowed (3)' });
        }

        // Check for conflicting reservations for the same book
        const conflictingReservations = await prisma.reservation.findMany({
            where: {
                bookId: Number(bookId),
                OR: [
                    {
                        startDate: { lte: new Date(endDate) },
                        endDate: { gte: new Date(startDate) },
                    },
                ],
            },
        });

        if (conflictingReservations.length > 0) {
            console.error("Date conflict with existing reservation.");
            return res.status(400).json({ message: 'The selected dates overlap with an existing reservation for this book.' });
        }

        // Create a new reservation
        const newReservation = await prisma.reservation.create({
            data: {
                userId: Number(userId),
                bookId: Number(bookId),
                startDate: new Date(startDate), // Convert to Date object
                endDate: new Date(endDate), // Convert to Date object
            },
        });

        return res.status(201).json(newReservation); // Respond with the newly created reservation
    } catch (error) {
        console.error("Error creating reservation:", error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}



// Delete reservation to confirm book return
async function deleteReservation(req: NextApiRequest, res: NextApiResponse) {
    const { userId, bookId } = req.query;

    if (!userId || !bookId) {
        return res.status(400).json({ message: 'User ID and Book ID are required' });
    }

    try {
        // Verify the user
        const user = await verifyToken(req);
        if (!user || user.id !== Number(userId)) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Check if the reservation exists
        const reservation = await prisma.reservation.findFirst({
            where: {
                userId: Number(userId),
                bookId: Number(bookId),
            },
        });

        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        // Delete the reservation
        await prisma.reservation.delete({
            where: { id: reservation.id },
        });

        return res.status(200).json({ message: 'Book return confirmed and reservation deleted' });
    } catch (error) {
        console.error("Error confirming book return:", error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}
