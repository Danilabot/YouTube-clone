const API_URL = 'http://localhost:5000/api/videos';

export const getLikesCount = async (videoId) => {
  const res = await fetch(`${API_URL}/${videoId}`);
  return res.json(); // { likes: number }
};

export const getLikeStatus = async (videoId) => {
  const res = await fetch(`${API_URL}/${videoId}/like-status`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return res.json(); // { liked: true/false }
};

export const toggleLike = async (videoId) => {
  const res = await fetch(`${API_URL}/${videoId}/like`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return res.json(); // { liked: true/false }
};
