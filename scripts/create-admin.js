#!/usr/bin/env node

/**
 * Script pour créer le premier utilisateur administrateur
 * Usage: node scripts/create-admin.js <email> <password> [minecraft-pseudo]
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function createAdmin() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error(
      "Usage: node scripts/create-admin.js <email> <password> [minecraft-pseudo]",
    );
    process.exit(1);
  }

  const [email, password, minecraftPseudo] = args;

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log(
        `Utilisateur ${email} existe déjà. Mise à jour du rôle vers ADMIN...`,
      );

      const updatedUser = await prisma.user.update({
        where: { email },
        data: { role: "ADMIN" },
      });

      console.log("✅ Utilisateur mis à jour avec succès !");
      console.log(`📧 Email: ${updatedUser.email}`);
      console.log(`👤 Nom: ${updatedUser.name || "Non défini"}`);
      console.log(
        `🎮 Pseudo Minecraft: ${updatedUser.minecraftPseudo || "Non défini"}`,
      );
      console.log(`🛡️  Rôle: ${updatedUser.role}`);
      return;
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Créer le nouvel utilisateur admin
    const admin = await prisma.user.create({
      data: {
        email,
        hashedPassword,
        name: minecraftPseudo || email.split("@")[0],
        minecraftPseudo: minecraftPseudo || null,
        role: "ADMIN",
      },
    });

    console.log("✅ Administrateur créé avec succès !");
    console.log(`📧 Email: ${admin.email}`);
    console.log(`👤 Nom: ${admin.name}`);
    console.log(
      `🎮 Pseudo Minecraft: ${admin.minecraftPseudo || "Non défini"}`,
    );
    console.log(`🛡️  Rôle: ${admin.role}`);
    console.log("");
    console.log("🔗 Vous pouvez maintenant vous connecter sur /admin");
  } catch (error) {
    console.error("❌ Erreur lors de la création de l'administrateur:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
