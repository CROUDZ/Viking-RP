import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { isAdmin, isModerator } from "./permissions";

export interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

/**
 * Middleware pour vérifier l'authentification
 */
export async function requireAuth(
  req: AuthenticatedRequest,
  res: NextApiResponse,
): Promise<boolean> {
  const session = await getServerSession(req, res, authOptions);
  console.log("Session:", session);

  if (!session || !session.user) {
    res.status(401).json({ error: "Non authentifié" });
    return false;
  }

  req.user = {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role || "USER",
  };

  return true;
}

/**
 * Middleware pour vérifier les droits administrateur
 */
export async function requireAdmin(
  req: AuthenticatedRequest,
  res: NextApiResponse,
): Promise<boolean> {
  const authenticated = await requireAuth(req, res);
  if (!authenticated) return false;

  if (!isAdmin(req.user?.role)) {
    res.status(403).json({ error: "Droits administrateur requis" });
    return false;
  }

  return true;
}

/**
 * Middleware pour vérifier les droits de modération
 */
export async function requireModerator(
  req: AuthenticatedRequest,
  res: NextApiResponse,
): Promise<boolean> {
  const authenticated = await requireAuth(req, res);
  if (!authenticated) return false;

  if (!isModerator(req.user?.role)) {
    res.status(403).json({ error: "Droits de modération requis" });
    return false;
  }

  return true;
}

/**
 * Wrapper pour les handlers d'API avec authentification
 */
export function withAuth(
  handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>,
) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    const authenticated = await requireAuth(req, res);
    if (!authenticated) return;

    return handler(req, res);
  };
}

/**
 * Wrapper pour les handlers d'API avec droits admin
 */
export function withAdmin(
  handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>,
) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    const authorized = await requireAdmin(req, res);
    if (!authorized) return;

    return handler(req, res);
  };
}

/**
 * Wrapper pour les handlers d'API avec droits modérateur
 */
export function withModerator(
  handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>,
) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    const authorized = await requireModerator(req, res);
    if (!authorized) return;

    return handler(req, res);
  };
}
