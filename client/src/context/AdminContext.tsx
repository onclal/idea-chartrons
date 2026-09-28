import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { ADMIN_SESSION_KEY } from '../config/admin';
import { verifyAdminPasscode } from '../lib/adminAccess';

interface AdminContextValue {
  isAdminMode: boolean;
  /** Code administrateur vérifié de la session, transmis aux fonctions protégées de la base. */
  adminCode: string | null;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

function readSession(): string | null {
  try {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) || null;
  } catch {
    return null;
  }
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [adminCode, setAdminCode] = useState<string | null>(readSession);

  useEffect(() => {
    try {
      if (adminCode) sessionStorage.setItem(ADMIN_SESSION_KEY, adminCode);
      else sessionStorage.removeItem(ADMIN_SESSION_KEY);
    } catch {
      // ignore
    }
  }, [adminCode]);

  const login = useCallback(async (password: string) => {
    const code = password.trim();
    const ok = await verifyAdminPasscode(code).catch(() => false);
    if (!ok) return false;
    setAdminCode(code);
    return true;
  }, []);

  const logout = useCallback(() => {
    setAdminCode(null);
  }, []);

  return (
    <AdminContext.Provider value={{ isAdminMode: adminCode !== null, adminCode, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}
