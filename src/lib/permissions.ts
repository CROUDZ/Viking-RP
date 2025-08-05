/**
 * Fonctions utilitaires pour gérer les permissions des utilisateurs
 */

export enum UserRole {
  USER = "USER",
  MODERATOR = "MODERATOR",
  ADMIN = "ADMIN",
}

/**
 * Vérifie si un utilisateur a le rôle d'administrateur
 */
export function isAdmin(userRole?: string): boolean {
  return userRole === UserRole.ADMIN;
}

/**
 * Vérifie si un utilisateur a le rôle de modérateur ou plus
 */
export function isModerator(userRole?: string): boolean {
  return userRole === UserRole.MODERATOR || userRole === UserRole.ADMIN;
}

/**
 * Vérifie si un utilisateur a au minimum un certain rôle
 */
export function hasMinimumRole(
  userRole?: string,
  minimumRole: UserRole = UserRole.USER,
): boolean {
  const roleHierarchy = {
    [UserRole.USER]: 1,
    [UserRole.MODERATOR]: 2,
    [UserRole.ADMIN]: 3,
  };

  const userLevel = roleHierarchy[userRole as UserRole] || 0;
  const requiredLevel = roleHierarchy[minimumRole];

  return userLevel >= requiredLevel;
}

/**
 * Obtient une liste d'actions disponibles selon le rôle de l'utilisateur
 */
export function getAvailableActions(userRole?: string) {
  const actions = {
    canViewUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canViewAdminPanel: false,
    canManageServer: false,
    canViewLogs: false,
    canModerateContent: false,
  };

  if (isModerator(userRole)) {
    actions.canModerateContent = true;
    actions.canViewLogs = true;
  }

  if (isAdmin(userRole)) {
    actions.canViewUsers = true;
    actions.canEditUsers = true;
    actions.canDeleteUsers = true;
    actions.canViewAdminPanel = true;
    actions.canManageServer = true;
  }

  return actions;
}
