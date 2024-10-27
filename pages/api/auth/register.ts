import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { name, email, password } = req.body;

        // Check if all fields are provided
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Tous les champs sont obligatoires." });
        }

        try {
            // Check if the user already exists
            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: "Cet e-mail est déjà utilisé." });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a new user
            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                },
            });

            return res.status(201).json({ message: "Inscription réussie!", user });
        } catch (error) {
            console.error("Error during registration:", error);
            return res.status(500).json({ message: "Une erreur est survenue lors de l'inscription." });
        }
    }

    return res.status(405).json({ message: "Méthode non autorisée." });
}
