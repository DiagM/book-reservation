import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "PUT") {
        const { name, email, password } = req.body;

        // Validate token and extract user ID
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        try {
            const jwtSecret = process.env.JWT_SECRET;
            const decoded: any = jwt.verify(token, jwtSecret);
            const userId = decoded.id;

            // Update user information
            const updates: any = {};
            if (name) updates.name = name;
            if (email) updates.email = email;
            if (password) {
                // Hash new password if provided
                updates.password = await bcrypt.hash(password, 10);
            }

            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: updates,
            });

            // Exclude the password from the response
            const { password: _, ...userWithoutPassword } = updatedUser;

            return res.status(200).json({ user: userWithoutPassword });
        } catch (error) {
            console.error("Profile update error:", error);
            return res.status(500).json({ message: "Internal server error." });
        }
    }

    return res.status(405).json({ message: "Method not allowed." });
}
