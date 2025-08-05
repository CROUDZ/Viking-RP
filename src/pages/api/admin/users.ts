import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "../../../lib/prisma";
import { isAdmin } from "../../../lib/permissions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Vérifier l'authentification
  const session = await getServerSession(req, res, authOptions);

  if (!session || !isAdmin(session.user?.role)) {
    return res
      .status(403)
      .json({ error: "Accès refusé. Droits administrateur requis." });
  }

  if (req.method === "GET") {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;
      const pageNumber = parseInt(page as string);
      const limitNumber = parseInt(limit as string);
      const skip = (pageNumber - 1) * limitNumber;

      // Construire la condition de recherche
      const searchCondition = search
        ? {
            OR: [
              {
                email: {
                  contains: search as string,
                  mode: "insensitive" as const,
                },
              },
              {
                name: {
                  contains: search as string,
                  mode: "insensitive" as const,
                },
              },
              {
                minecraftPseudo: {
                  contains: search as string,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {};

      // Récupérer les utilisateurs avec pagination
      const [users, totalUsers] = await Promise.all([
        prisma.user.findMany({
          where: searchCondition,
          select: {
            id: true,
            name: true,
            email: true,
            minecraftPseudo: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            _count: {
              select: {
                sessions: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: limitNumber,
        }),
        prisma.user.count({ where: searchCondition }),
      ]);

      const totalPages = Math.ceil(totalUsers / limitNumber);

      return res.status(200).json({
        users,
        pagination: {
          currentPage: pageNumber,
          totalPages,
          totalUsers,
          hasNextPage: pageNumber < totalPages,
          hasPrevPage: pageNumber > 1,
        },
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
      return res.status(500).json({ error: "Erreur interne du serveur" });
    }
  }

  if (req.method === "PATCH") {
    try {
      const { userId, role } = req.body;

      if (!userId || !role) {
        return res.status(400).json({ error: "ID utilisateur et rôle requis" });
      }

      // Vérifier que l'utilisateur existe
      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }

      // Empêcher l'admin de modifier son propre rôle
      if (userId === session.user.id) {
        return res
          .status(400)
          .json({ error: "Vous ne pouvez pas modifier votre propre rôle" });
      }

      // Mettre à jour le rôle
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { role },
        select: {
          id: true,
          name: true,
          email: true,
          minecraftPseudo: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return res.status(200).json({ user: updatedUser });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
      return res.status(500).json({ error: "Erreur interne du serveur" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "ID utilisateur requis" });
      }

      // Empêcher l'admin de supprimer son propre compte
      if (userId === session.user.id) {
        return res
          .status(400)
          .json({ error: "Vous ne pouvez pas supprimer votre propre compte" });
      }

      // Vérifier que l'utilisateur existe
      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }

      // Supprimer l'utilisateur (les relations seront supprimées automatiquement grâce aux contraintes)
      await prisma.user.delete({
        where: { id: userId },
      });

      return res
        .status(200)
        .json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
      return res.status(500).json({ error: "Erreur interne du serveur" });
    }
  }

  return res.status(405).json({ error: "Méthode non autorisée" });
}
