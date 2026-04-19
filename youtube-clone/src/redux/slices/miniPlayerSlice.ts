import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface MiniPlayerState {
  visible: boolean
  videoId: string | null
  categoryId: string
  title: string
  channelTitle: string
  thumbnail: string
}

const initialState: MiniPlayerState = {
  visible: false,
  videoId: null,
  categoryId: '0',
  title: '',
  channelTitle: '',
  thumbnail: '',
}

const miniPlayerSlice = createSlice({
  name: 'miniPlayer',
  initialState,
  reducers: {
    showMiniPlayer(state, action: PayloadAction<{
      videoId: string
      categoryId: string
      title: string
      channelTitle: string
      thumbnail: string
    }>) {
      state.visible = true
      state.videoId = action.payload.videoId
      state.categoryId = action.payload.categoryId
      state.title = action.payload.title
      state.channelTitle = action.payload.channelTitle
      state.thumbnail = action.payload.thumbnail
    },
    hideMiniPlayer(state) {
      state.visible = false
    },
    closeMiniPlayer(state) {
      state.visible = false
      state.videoId = null
    },
  },
})

export const { showMiniPlayer, hideMiniPlayer, closeMiniPlayer } = miniPlayerSlice.actions
export default miniPlayerSlice.reducer
