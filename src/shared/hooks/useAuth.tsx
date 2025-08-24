import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
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
  private readonly listeners: {
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

async function fetchUser(token: string): Promise<User> {
  const res = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      console.warn("AuthProvider: token invalid, logging out");
      authEvents.emit("logout", undefined);
      throw new Error("Unauthorized");
    }
    throw new Error(`Spotify /me failed: ${res.status}`);
  }

  return res.json() as Promise<User>;
}

function loadCachedUser(): User | null {
  const cached = localStorage.getItem(USER_KEY);
  return cached ? (JSON.parse(cached) as User) : null;
}

export function AuthProvider({ children }: { readonly children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    sessionStorage.getItem(TOKEN_KEY)
  );
  const [user, setUser] = useState<User | null>(() => loadCachedUser());
  const [loading, setLoading] = useState<boolean>(!!token);

  const fetchMe = useCallback(async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await fetchUser(token);
      setUser(data);
      localStorage.setItem(USER_KEY, JSON.stringify(data));
    } catch (e) {
      if (!navigator.onLine) {
        console.warn("AuthProvider: offline, using cached user");
        const cached = loadCachedUser();
        if (cached) setUser(cached);
      } else {
        console.warn("AuthProvider: /me failed, logging out", e);
        authEvents.emit("logout", undefined);
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

  useEffect(() => {
    const handleOnline = () => {
      if (token) {
        fetchMe();
      }
    };
    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, [token, fetchMe]);

  const logout = useCallback(() => {
    authEvents.emit("logout", undefined);
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuth: !!user,
      loading,
      logout,
      refresh: fetchMe,
    }),
    [token, user, loading, logout, fetchMe]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
