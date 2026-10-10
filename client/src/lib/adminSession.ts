import { ADMIN_SESSION_KEY } from '../config/admin';

/** Vrai si l'administrateur est connecté sur cet appareil. */
export function isAdminSession(): boolean {
  try {
    return Boolean(sessionStorage.getItem(ADMIN_SESSION_KEY));
  } catch {
    return false;
  }
}
