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
      // Récupérer les statistiques générales
      const [
        totalUsers,
        totalAdmins,
        totalModerators,
        recentUsers,
        activeSessions,
      ] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: "ADMIN" } }),
        prisma.user.count({ where: { role: "MODERATOR" } }),
        prisma.user.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 derniers jours
            },
          },
        }),
        prisma.session.count({
          where: {
            expires: {
              gte: new Date(),
            },
          },
        }),
      ]);

      // Récupérer les utilisateurs récents
      const latestUsers = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          minecraftPseudo: true,
          role: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      });

      // Statistiques par mois (6 derniers mois)
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      // Formatage des données mensuelles
      const monthlyStats = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const count = await prisma.user.count({
          where: {
            createdAt: {
              gte: monthStart,
              lte: monthEnd,
            },
          },
        });

        monthlyStats.push({
          month: monthStart.toLocaleString("fr-FR", {
            month: "long",
            year: "numeric",
          }),
          users: count,
        });
      }

      return res.status(200).json({
        stats: {
          totalUsers,
          totalAdmins,
          totalModerators,
          recentUsers,
          activeSessions,
        },
        latestUsers,
        monthlyStats,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
      return res.status(500).json({ error: "Erreur interne du serveur" });
    }
  }

  return res.status(405).json({ error: "Méthode non autorisée" });
}
