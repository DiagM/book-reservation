import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { email, password } = req.body;

        // Input validation (you can use a library like Joi or Zod for more robust validation)
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        try {
            // Find user by email
            const user = await prisma.user.findUnique({ where: { email } });

            // User not found
            if (!user) {
                return res.status(401).json({ message: "Invalid email or password." });
            }

            // Compare password
            const isPasswordValid = await bcrypt.compare(password, user.password);

            // Invalid password
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid email or password." });
            }

            // Ensure JWT_SECRET is defined
            const jwtSecret = process.env.JWT_SECRET;
            if (!jwtSecret) {
                console.log("Request method:", req.method);
                console.log("Request body:", req.body);
                console.log("User found:", user);
                console.log("Password validation result:", isPasswordValid);
                console.log("Generated JWT token:", token);
                console.log("User data without password:", userWithoutPassword);
                return res.status(500).json({ message: "Internal server error: JWT secret is not defined." });
            }

            // Create JWT token
            const token = jwt.sign(
                { id: user.id, email: user.email, isAdmin: user.isAdmin },
                jwtSecret,
                { expiresIn: "1h" } // Token expiration time
            );

            // Return the token and user info, but omit sensitive information
            const { password: _, ...userWithoutPassword } = user; // Exclude password from user data

            return res.status(200).json({ token, user: userWithoutPassword });
        } catch (error) {
            console.error("Login error:", error);
            return res.status(500).json({ message: "Internal server error." });
        }
    }

    return res.status(405).json({ message: "Method not allowed." });
}
