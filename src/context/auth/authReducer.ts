import type { AuthUser } from '../../types/domain';

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
}

type Action =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: AuthUser; token: string } }
  | { type: 'AUTH_LOGOUT' };

export const initialAuthState: AuthState = {
  user: null,
  token: null,
  loading: false,
};

export function authReducer(state: AuthState, action: Action): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true };
    case 'AUTH_SUCCESS':
      return { user: action.payload.user, token: action.payload.token, loading: false };
    case 'AUTH_LOGOUT':
      return { ...initialAuthState };
    default:
      return state;
  }
}
