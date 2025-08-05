import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma"; // Assurez-vous que le chemin est correct

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Ajoute ce log pour vérifier que la route est bien appelée
  console.log("API /api/formulaire called:", req.method);

  if (req.method === "POST") {
    try {
      let data = req.body;
      if (typeof data === "string") {
        data = JSON.parse(data);
      }
      if (!data.nomPersonnage || !data.discordPseudo) {
        return res
          .status(400)
          .json({ error: "Champs obligatoires manquants." });
      }
      // Conversion des champs en Int pour Prisma
      if (typeof data.ageIRL === "string")
        data.ageIRL = parseInt(data.ageIRL, 10);
      if (typeof data.ageRP === "string") data.ageRP = parseInt(data.ageRP, 10);

      const formulaire = await prisma.formulaire.create({ data });
      return res.status(201).json(formulaire);
    } catch (err) {
      console.error("Erreur POST /api/formulaire:", err);
      return res
        .status(400)
        .json({ error: "Erreur lors de la création du formulaire." });
    }
  }

  if (req.method === "GET") {
    try {
      const { id } = req.query;
      if (id) {
        const formulaire = await prisma.formulaire.findUnique({
          where: { id: typeof id === "string" ? id : id[0] },
        });
        if (!formulaire)
          return res.status(404).json({ error: "Formulaire non trouvé." });
        return res.status(200).json(formulaire);
      } else {
        const formulaires = await prisma.formulaire.findMany();
        return res.status(200).json(formulaires);
      }
    } catch (err) {
      console.error("Erreur GET /api/formulaire:", err);
      return res.status(400).json({ error: "Erreur lors de la récupération." });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: "ID requis." });
      await prisma.formulaire.delete({
        where: { id: typeof id === "string" ? id : id[0] },
      });
      return res.status(204).end();
    } catch (err) {
      console.error("Erreur DELETE /api/formulaire:", err);
      return res.status(400).json({ error: "Erreur lors de la suppression." });
    }
  }

  res.setHeader("Allow", ["POST", "GET", "DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
