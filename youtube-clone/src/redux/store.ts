import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import themeReducer from './slices/themeSlice'
import channelsReducer from './slices/channelsSlice'
import uiReducer from './slices/uiSlice'
import miniPlayerReducer from './slices/miniPlayerSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    channels: channelsReducer,
    ui: uiReducer,
    miniPlayer: miniPlayerReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch