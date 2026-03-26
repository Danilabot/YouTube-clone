import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface AuthUser {
  id: number
  name: string
  email: string
}

interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuth: boolean
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuth: false,
  loading: false,
  error: null,
}

interface SetCredentialsPayload {
  user: AuthUser
  token: string
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<SetCredentialsPayload>) {
      const { user, token } = action.payload
      state.user = user
      state.token = token
      state.isAuth = true
      state.error = null
    },
    logout(state) {
      state.user = null
      state.token = null
      state.isAuth = false
      state.error = null
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
      state.loading = false
    },
  },
})

export const { setCredentials, logout, setLoading, setError } = authSlice.actions
export default authSlice.reducer
