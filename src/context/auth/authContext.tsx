import { createContext, useContext, useMemo, useReducer } from 'react';
import { authReducer, initialAuthState } from './authReducer';
import { mockLogin, logout as doLogout } from '../../services/auth';
import { tokenStore, userStore } from '../../utils/authStore';

type AuthContextValue = {
  user: typeof initialAuthState.user;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    ...initialAuthState,
    token: tokenStore.get(),
    user: userStore.get(),   //restore user on refresh
  });

  const value = useMemo<AuthContextValue>(() => ({
    user: state.user,
    token: state.token,
    loading: state.loading,
    isAuthenticated: !!state.token,
    async login(email, password) {
      dispatch({ type: "AUTH_START" });
      const { user, token } = await mockLogin(email, password);
      tokenStore.set(token);
      userStore.set(user);    // persist user
      dispatch({ type: "AUTH_SUCCESS", payload: { user, token } });
    },
    logout() {
      doLogout();
      tokenStore.set(null);
      userStore.set(null);    // clear user
      dispatch({ type: "AUTH_LOGOUT" });
    },
  }), [state.user, state.token, state.loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
