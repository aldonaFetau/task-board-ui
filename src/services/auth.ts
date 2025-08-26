import { tokenStore } from '../utils/tokenStore';
import type { AuthUser } from '../types/domain';
import {api} from './api';


export const mockLogin = async (email: string, _password: string) => {

  const user: AuthUser = { id: 'u1', email, name: email.split('@')[0] };
  const token = 'mock-token';
  tokenStore.set(token);
  return { user, token };
};

//real login
export const login = async (email: string, password: string) => {
  try {
    // Call the backend login endpoint
    const response = await api.post<{ token: string; user: AuthUser }>('/auth/login', {
      email,
      password,
    });

    const { token, user } = response.data;

    // Store the token (for future API calls)
    tokenStore.set(token);

    return { user, token };
  } catch (err: any) {
    throw new Error(err.response?.data?.message || 'Login failed');
  }
};
export const logout = () => tokenStore.set(null);
