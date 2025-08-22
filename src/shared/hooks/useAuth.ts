import { useEffect, useState } from "react";

export function useAuth() {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = sessionStorage.getItem("access_token");
    if (accessToken) {
      setIsAuth(true);
      setToken(accessToken);
    } else {
      setIsAuth(false);
      setToken(null);
    }
    setLoading(false);
  }, []);

  return { loading, isAuth, token };
}
