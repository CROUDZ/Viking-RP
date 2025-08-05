/**
 * Utilitaires pour l'intégration de Minecraft
 */

/**
 * Valide un pseudo Minecraft (règles de base)
 */
export function validateMinecraftUsername(username: string): boolean {
  if (!username || username.length < 3 || username.length > 16) {
    return false;
  }

  // Seuls les caractères alphanumériques et underscores sont autorisés
  const validPattern = /^[a-zA-Z0-9_]+$/;
  return validPattern.test(username);
}

/**
 * Valide un UUID Minecraft
 */
export function validateMinecraftUUID(uuid: string): boolean {
  if (!uuid) return false;

  // UUID format: 8-4-4-4-12 characters
  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidPattern.test(uuid);
}
