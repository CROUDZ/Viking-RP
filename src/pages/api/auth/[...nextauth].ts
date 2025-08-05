import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "../../../lib/prisma";
import { hashPassword, comparePassword } from "../../../lib/auth";

// Extend the built-in session types
declare module "next-auth" {
  interface User {
    minecraftPseudo?: string;
    minecraftUUID?: string;
    role?: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      minecraftPseudo?: string;
      minecraftUUID?: string;
      role?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    minecraftPseudo?: string;
    minecraftUUID?: string;
    role?: string;
  }
}

// Extended User interface for database operations
interface ExtendedUser {
  id: string;
  email: string;
  name: string | null;
  image?: string | null;
  hashedPassword?: string;
  minecraftPseudo?: string;
  minecraftUUID?: string;
  microsoftToken?: string;
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
        minecraftPseudo: { label: "Pseudo Minecraft", type: "text" },
        isRegistering: { label: "Is Registering", type: "hidden" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email et mot de passe requis");
        }

        const isRegistering = credentials.isRegistering === "true";

        if (isRegistering) {
          // Inscription
          if (!credentials.minecraftPseudo) {
            throw new Error("Pseudo Minecraft requis pour l'inscription");
          }

          // Vérifier si l'utilisateur existe déjà
          const existingUser = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (existingUser) {
            throw new Error("Un utilisateur avec cet email existe déjà");
          }

          // Hasher le mot de passe
          const hashedPassword = await hashPassword(credentials.password);

          // Créer le nouvel utilisateur
          const user = await prisma.user.create({
            data: {
              email: credentials.email,
              hashedPassword,
              minecraftPseudo: credentials.minecraftPseudo,
              name: credentials.minecraftPseudo,
              role: "USER",
            },
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            minecraftPseudo:
              (user as ExtendedUser).minecraftPseudo || undefined,
            minecraftUUID: (user as ExtendedUser).minecraftUUID || undefined,
            role: user.role,
          };
        } else {
          // Connexion
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user || !(user as ExtendedUser).hashedPassword) {
            throw new Error("Identifiants invalides");
          }

          const isPasswordValid = await comparePassword(
            credentials.password,
            (user as ExtendedUser).hashedPassword!,
          );

          if (!isPasswordValid) {
            throw new Error("Identifiants invalides");
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            minecraftPseudo:
              (user as ExtendedUser).minecraftPseudo || undefined,
            minecraftUUID: (user as ExtendedUser).minecraftUUID || undefined,
            role: user.role,
          };
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // Ajouter les informations Minecraft au token JWT
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (dbUser) {
          token.minecraftUUID =
            (dbUser as ExtendedUser).minecraftUUID || undefined;
          token.minecraftPseudo =
            (dbUser as ExtendedUser).minecraftPseudo || undefined;
          token.userId = dbUser.id;
          token.role = dbUser.role;
        }
      }
      return token;
    },

    async session({ session, token }) {
      // Ajouter les informations Minecraft à la session
      if (token && session.user) {
        session.user.id = token.userId as string;
        session.user.minecraftUUID = token.minecraftUUID as string;
        session.user.minecraftPseudo = token.minecraftPseudo as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
