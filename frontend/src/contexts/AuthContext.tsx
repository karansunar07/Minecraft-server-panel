import { createContext, useContext, useMemo, useState } from "react";

type AuthContextValue = {
  user: { name: string; role: "owner" | "admin" } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthContextValue["user"]>({ name: "Karan", role: "admin" });

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      async login() {
        setUser({ name: "Karan", role: "admin" });
      },
      logout() {
        setUser(null);
      }
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
