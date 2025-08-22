import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";

const TOKEN_KEY = "access_token";

type User = {
  id: string;
  display_name: string;
  email?: string;
};

type AuthContextType = {
  token: string | null;
  user: User | null;
  isAuth: boolean;
  loading: boolean;
  logout: () => void;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthEventType = "token" | "logout";

class AuthEvents {
  private listeners: Record<AuthEventType, Array<(payload?: any) => void>> = {
    token: [],
    logout: [],
  };

  on(type: AuthEventType, cb: (payload?: any) => void) {
    this.listeners[type].push(cb);
    return () => {
      this.listeners[type] = this.listeners[type].filter((fn) => fn !== cb);
    };
  }

  emit(type: AuthEventType, payload?: any) {
    this.listeners[type].forEach((cb) => cb(payload));
  }
}

export const authEvents = new AuthEvents();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    sessionStorage.getItem(TOKEN_KEY)
  );
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(!!token);

  const fetchMe = useCallback(async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Spotify /me failed: ${res.status}`);
      const data: User = await res.json();
      setUser(data);
    } catch (e) {
      console.error("AuthProvider: /me failed", e);
      setUser(null);
      sessionStorage.removeItem(TOKEN_KEY);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  useEffect(() => {
    const unsubToken = authEvents.on("token", (newToken: string) => {
      sessionStorage.setItem(TOKEN_KEY, newToken);
      setToken(newToken);
    });
    const unsubLogout = authEvents.on("logout", () => {
      sessionStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
    });
    return () => {
      unsubToken();
      unsubLogout();
    };
  }, []);

  const logout = useCallback(() => {
    authEvents.emit("logout");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuth: !!user,
        loading,
        logout,
        refresh: fetchMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
