import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/types';
import type { RootState } from './index';

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  loginError: string | null;
}

const initialState: AuthState = {
  currentUser: null,
  isAuthenticated: false,
  loginError: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
      state.loginError = null;
    },
    setLoginError(state, action: PayloadAction<string>) {
      state.loginError = action.payload;
    },
    clearLoginError(state) {
      state.loginError = null;
    },
    logout(state) {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.loginError = null;
    },
  },
});

export const { setUser, setLoginError, clearLoginError, logout } = authSlice.actions;

export const selectCurrentUser      = (s: RootState) => s.auth.currentUser;
export const selectUserRole         = (s: RootState) => s.auth.currentUser?.role ?? null;
export const selectUserRoleGroup    = (s: RootState) => s.auth.currentUser?.roleGroup ?? null;
export const selectIsAuthenticated  = (s: RootState) => s.auth.isAuthenticated;
export const selectLoginError       = (s: RootState) => s.auth.loginError;

/** True when logged-in user is Super Admin (Admin / NBA_Coordinator / HOD) */
export const selectIsAdmin = (s: RootState) =>
  s.auth.currentUser?.roleGroup === 'Super Admin';

export default authSlice.reducer;
