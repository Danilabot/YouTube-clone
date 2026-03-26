import { API_BASE_URL } from './config';
import { getToken } from '../utils/auth';

const API_URL = `${API_BASE_URL}/api/comments`;

interface LikesResponse {
    likes:number
}
interface LikeStatusResponse {
    liked: boolean
}

export const getLikesCount = async (commentId:string):Promise<LikesResponse> => {
  const res = await fetch(`${API_URL}/${commentId}`);
  return res.json(); // { likes: number }
};

export const getLikeStatus = async (commentId:string):Promise<LikeStatusResponse> => {
  const res = await fetch(`${API_URL}/${commentId}/like-status`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json(); // { liked: true/false }
};

export const toggleLike = async (commentId:string): Promise<LikeStatusResponse> => {
  const res = await fetch(`${API_URL}/${commentId}/like`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json(); // { liked: true/false }
};
