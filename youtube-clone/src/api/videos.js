import { API_KEY } from '../utils/data'

export const fetchPopularVideos = async (category) => {
  let allVideos = []
  let pageToken = ''
  
  for (let i = 0; i < 2; i++) {
    const url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=50&regionCode=US&videoCategoryId=${category}&key=${API_KEY}${pageToken ? `&pageToken=${pageToken}` : ''}`
    
    const res = await fetch(url)
    const data = await res.json()
    allVideos = [...allVideos, ...data.items]
    pageToken = data.nextPageToken
    if (!pageToken) break
  }
  
  return allVideos
}