const API_URL = 'http://localhost:5000/api/saved';

export const saveVideo = async (videoId:string, videoData?:any) =>{
    const res = await fetch(`${API_URL}/${videoId}`, {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({videoData})
    })
    return res.json()  // { success: true, saved: true }
}
export const unsaveVideo = async (videoId: string) => {
  const res = await fetch(`${API_URL}/${videoId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return res.json(); // { success: true, saved: false }
};
export const getSavedVideos = async () => {
  const res = await fetch(`${API_URL}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return res.json(); // { success: true, savedVideos: [] }
};

export const getSaveStatus = async (videoId: string) => {
  const res = await fetch(`${API_URL}/${videoId}/status`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return res.json(); // { success: true, saved: boolean }
};