import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { auth } from './firebase';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
    return unsub;
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      loginWithGoogle: async () => {
        await signInWithPopup(auth, new GoogleAuthProvider());
      },
      logout: async () => {
        await signOut(auth);
      },
    }),
    [loading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
