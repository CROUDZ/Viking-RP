import { NextApiRequest, NextApiResponse } from "next";
import { hashPassword } from "@/lib/auth";
import { validateMinecraftUsername } from "@/lib/minecraft";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  const { email, password, minecraftPseudo } = req.body;

  // Validation des données
  if (!email || !password || !minecraftPseudo) {
    return res.status(400).json({
      message: "Email, mot de passe et pseudo Minecraft sont requis",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      message: "Le mot de passe doit contenir au moins 8 caractères",
    });
  }

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { minecraftPseudo: minecraftPseudo },
        ],
      },
    });

    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        return res.status(400).json({
          message: "Un compte avec cet email existe déjà",
        });
      }
      if (existingUser.minecraftPseudo === minecraftPseudo) {
        return res.status(400).json({
          message: "Ce pseudo Minecraft est déjà utilisé",
        });
      }
    }

    // Valider le pseudo Minecraft
    const isMinecraftValid = validateMinecraftUsername(minecraftPseudo);
    if (!isMinecraftValid) {
      return res.status(400).json({
        message:
          "Pseudo Minecraft invalide. Il doit contenir entre 3 et 16 caractères alphanumériques.",
      });
    }

    // Hacher le mot de passe
    const hashedPassword = await hashPassword(password);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        hashedPassword: hashedPassword,
        name: minecraftPseudo,
        minecraftPseudo: minecraftPseudo,
        minecraftUUID: "", // À implémenter avec l'API Mojang si nécessaire
      },
    });

    // Retourner la réponse sans le mot de passe
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hashedPassword: _, ...userWithoutPassword } = user;

    res.status(201).json({
      message: "Inscription réussie",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    res.status(500).json({
      message: "Erreur interne du serveur",
    });
  } finally {
    await prisma.$disconnect();
  }
}
