import { useEffect, useState } from 'react'
import { unsaveVideo, saveVideo, getSaveStatus } from '../../api/saved'
import save from '../../assets/save.png'
import toast from 'react-hot-toast'
import styles from './SaveButton.module.css'
import { getToken } from '../../utils/auth'
import type { YouTubeVideo } from '../../types/youtube'

interface SaveButtonProps {
  videoId: string
  videoData?: YouTubeVideo
}

export const SaveButton = ({ videoId, videoData }: SaveButtonProps) => {
  const [isSaved, setIsSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  const token = getToken()
  useEffect(() => {
    if (token) {
      const loadSave = async () => {
        const res = await getSaveStatus(videoId)
        setIsSaved(res.saved)
      }
      loadSave()
    }
  }, [videoId])

  const handleClick = async () => {
    if (!token) {
      toast.error('Войдите чтобы сохранять видео')
      return
    }

    setLoading(true)
    try {
      if (isSaved) {
        await unsaveVideo(videoId)
        setIsSaved(false)
        toast.success('Видео удалено из сохранённых')
      } else {
        await saveVideo(videoId, videoData)
        setIsSaved(true)
        toast.success('Видео сохранено!')
      }
    } catch (error) {
      toast.error('Ошибка при сохранении')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
  onClick={handleClick}
  disabled={loading}
  className={styles.saveButton} 
>
  <img 
    src={save} 
    alt={isSaved ? 'saved' : 'save'} 
  />
  сохранить
</button>
  )
}
