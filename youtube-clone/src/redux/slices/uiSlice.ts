import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UiState {
  isProfileMenuOpen: boolean
  isAuthModalOpen: boolean
  authMode: 'login' | 'register'
  isUploadModalOpen: boolean
}

const initialState: UiState = {
  isProfileMenuOpen: false,
  isAuthModalOpen: false,
  authMode: 'login',
  isUploadModalOpen: false,
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
    openUploadModal(state) {
      state.isUploadModalOpen = true
      state.isProfileMenuOpen = false
    },
    closeUploadModal(state) {
      state.isUploadModalOpen = false
    },
  },
})

export const { openProfileMenu, closeProfileMenu, openAuthModal, closeAuthModal, openUploadModal, closeUploadModal } = uiSlice.actions
export default uiSlice.reducer
