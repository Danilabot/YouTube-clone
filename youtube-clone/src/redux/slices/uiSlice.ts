import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UiState {
  isProfileMenuOpen: boolean
  isAuthModalOpen: boolean
  authMode: 'login' | 'register'
}

const initialState: UiState = {
  isProfileMenuOpen: false,
  isAuthModalOpen: false,
  authMode: 'login',
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openProfileMenu(state) {
      state.isProfileMenuOpen = true
    },
    closeProfileMenu(state) {
      state.isProfileMenuOpen = false
    },
    openAuthModal(state, action: PayloadAction<'login' | 'register'>) {
      state.authMode = action.payload
      state.isAuthModalOpen = true
      state.isProfileMenuOpen = false
    },
    closeAuthModal(state) {
      state.isAuthModalOpen = false
    },
  },
})

export const { openProfileMenu, closeProfileMenu, openAuthModal, closeAuthModal } = uiSlice.actions
export default uiSlice.reducer
