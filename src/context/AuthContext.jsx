import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, tokens } from '../services/api';
import { AUTH_EVENT, STORAGE_KEYS } from '../utils/constants';

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.user);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStoredUser(user) {
  if (user) localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  else localStorage.removeItem(STORAGE_KEYS.user);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [bootstrapping, setBootstrapping] = useState(
    () => !!tokens.getAccessToken()
  );
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    const onExpired = () => {
      setUser(null);
      setSessionExpired(true);
    };
    window.addEventListener(AUTH_EVENT, onExpired);
    return () => window.removeEventListener(AUTH_EVENT, onExpired);
  }, []);

  // Se temos token mas não temos user, tenta rehidratar via /.
  useEffect(() => {
    let cancelled = false;
    async function bootstrap() {
      if (!tokens.getAccessToken()) {
        setBootstrapping(false);
        return;
      }
      if (user) {
        setBootstrapping(false);
        return;
      }
      try {
        const data = await api.dashboard.get();
        if (!cancelled && data?.user) {
          setUser(data.user);
          writeStoredUser(data.user);
        }
      } catch {
        // erros já tratados no api.js (refresh + logout em 401)
      } finally {
        if (!cancelled) setBootstrapping(false);
      }
    }
    bootstrap();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(async ({ email, senha }) => {
    const body = await api.auth.login({ email, senha });
    tokens.setTokens(body);
    setSessionExpired(false);
    try {
      const dash = await api.dashboard.get();
      if (dash?.user) {
        setUser(dash.user);
        writeStoredUser(dash.user);
      }
    } catch {
      /* best-effort */
    }
    return body;
  }, []);

  const register = useCallback(async ({ nome, email, senha }) => {
    await api.auth.register({ nome, email, senha });
    return login({ email, senha });
  }, [login]);

  const logout = useCallback(async () => {
    try {
      await api.auth.logout();
    } catch {
      /* best-effort: token pode já estar inválido */
    }
    tokens.clearTokens();
    setUser(null);
    writeStoredUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user && !!tokens.getAccessToken(),
      bootstrapping,
      sessionExpired,
      clearSessionExpired: () => setSessionExpired(false),
      login,
      register,
      logout,
    }),
    [user, bootstrapping, sessionExpired, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  return ctx;
}
