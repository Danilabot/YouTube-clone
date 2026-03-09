const API_URL = 'http://localhost:5000/api/videos'

export const getDislikeStatus = async (videoId) => {
  const res = await fetch(`${API_URL}/${videoId}/dislike-status`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })
  return res.json()
}

export const toggleDislike = async (videoId) => {
  const res = await fetch(`${API_URL}/${videoId}/dislike`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })
  return res.json()
}