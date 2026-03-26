import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { YOUTUBE_API_KEY as API_KEY } from '../../utils/youtubeConfig'
import type { RootState } from '../store'

// Кеш логотипов каналов в сторе — не теряется при размонтировании компонентов
interface ChannelsState {
  logos: Record<string, string> // channelId → logo URL
  loading: Record<string, boolean>
}

const initialState: ChannelsState = {
  logos: {},
  loading: {},
}

// Thunk загружает лого только если его ещё нет в кеше
export const fetchChannelLogo = createAsyncThunk<
  { channelId: string; url: string | null },
  string,
  { state: RootState }
>(
  'channels/fetchLogo',
  async (channelId) => {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${API_KEY}`,
    )
    const data = await res.json()
    const url = data.items?.[0]?.snippet?.thumbnails?.default?.url || null
    return { channelId, url }
  },
  {
    // Не запускаем если уже загружено или загружается
    condition: (channelId, { getState }) => {
      const { channels } = getState()
      return !channels.logos[channelId] && !channels.loading[channelId]
    },
  },
)

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannelLogo.pending, (state, action) => {
        state.loading[action.meta.arg] = true
      })
      .addCase(fetchChannelLogo.fulfilled, (state, action) => {
        const { channelId, url } = action.payload
        if (url) state.logos[channelId] = url
        delete state.loading[channelId]
      })
      .addCase(fetchChannelLogo.rejected, (state, action) => {
        delete state.loading[action.meta.arg]
      })
  },
})

export default channelsSlice.reducer
