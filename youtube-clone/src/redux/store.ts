import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
export const store = configureStore({
  reducer: {
    auth: authReducer
    // потом добавим subscriptions: subscriptionsReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch