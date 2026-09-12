import {
  createContext, useCallback, useContext, useEffect, useState, type ReactNode,
} from 'react';
import { PRO_SESSION_KEY } from '../config/pro';
import { verifyShopAccess } from '../lib/shopAccess';

export interface ProSession {
  shopId: string;
  shopName: string;
}

interface ProAccessContextValue {
  session: ProSession | null;
  login: (code: string) => Promise<boolean>;
  enterAsAdmin: (shopId: string, shopName: string) => void;
  logout: () => void;
}

const ProAccessContext = createContext<ProAccessContextValue | null>(null);

function readSession(): ProSession | null {
  try {
    const raw = sessionStorage.getItem(PRO_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ProSession>;
    if (typeof parsed.shopId === 'string' && typeof parsed.shopName === 'string') {
      return { shopId: parsed.shopId, shopName: parsed.shopName };
    }
    return null;
  } catch {
    return null;
  }
}

export function ProAccessProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<ProSession | null>(readSession);

  useEffect(() => {
    try {
      if (session) sessionStorage.setItem(PRO_SESSION_KEY, JSON.stringify(session));
      else sessionStorage.removeItem(PRO_SESSION_KEY);
    } catch {
      // ignore
    }
  }, [session]);

  const login = useCallback(async (code: string) => {
    const result = await verifyShopAccess(code);
    if (!result) return false;
    setSession(result);
    return true;
  }, []);

  const enterAsAdmin = useCallback((shopId: string, shopName: string) => {
    setSession({ shopId, shopName });
  }, []);

  const logout = useCallback(() => setSession(null), []);

  return (
    <ProAccessContext.Provider value={{ session, login, enterAsAdmin, logout }}>
      {children}
    </ProAccessContext.Provider>
  );
}

export function useProAccess() {
  const ctx = useContext(ProAccessContext);
  if (!ctx) throw new Error('useProAccess must be used within ProAccessProvider');
  return ctx;
}
