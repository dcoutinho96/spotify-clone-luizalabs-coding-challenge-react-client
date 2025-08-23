import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";

const TOKEN_KEY = "access_token";
const USER_KEY = "auth_user";

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

type AuthEventPayloads = {
  token: string;
  logout: undefined;
};

type AuthEventType = keyof AuthEventPayloads;

class AuthEvents {
  private listeners: {
    [K in AuthEventType]: Set<(payload: AuthEventPayloads[K]) => void>;
  } = {
    token: new Set(),
    logout: new Set(),
  };

  on<K extends AuthEventType>(
    type: K,
    cb: (payload: AuthEventPayloads[K]) => void
  ) {
    this.listeners[type].add(cb);
    return () => {
      this.listeners[type].delete(cb);
    };
  }

  emit<K extends AuthEventType>(type: K, payload: AuthEventPayloads[K]) {
    this.listeners[type].forEach((cb) => cb(payload));
  }
}

export const authEvents = new AuthEvents();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    sessionStorage.getItem(TOKEN_KEY)
  );
  const [user, setUser] = useState<User | null>(() => {
    const cached = localStorage.getItem(USER_KEY);
    return cached ? (JSON.parse(cached) as User) : null;
  });
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
      localStorage.setItem(USER_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn("AuthProvider: /me failed, falling back to cached user", e);
      const cached = localStorage.getItem(USER_KEY);
      if (cached) {
        setUser(JSON.parse(cached));
      } else {
        setUser(null);
        sessionStorage.removeItem(TOKEN_KEY);
        setToken(null);
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  useEffect(() => {
    const unsubToken = authEvents.on("token", (newToken) => {
      sessionStorage.setItem(TOKEN_KEY, newToken);
      setToken(newToken);
    });
    const unsubLogout = authEvents.on("logout", () => {
      sessionStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setToken(null);
      setUser(null);
    });
    return () => {
      unsubToken();
      unsubLogout();
    };
  }, []);

  const logout = useCallback(() => {
    authEvents.emit("logout", undefined);
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
