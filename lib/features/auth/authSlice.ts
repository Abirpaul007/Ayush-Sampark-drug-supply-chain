import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'HOSPITAL' | 'PHARMACY' | 'VENDOR'
  organization: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
      state.loading = false
      state.error = null
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.loading = false
      state.error = null
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
      state.loading = false
    },
  },
})

export const { login, logout, setLoading, setError } = authSlice.actions
export default authSlice.reducer 