import { useState, useRef, useCallback } from 'react'
import styles from './UploadVideo.module.css'
import { createUserVideo } from '../../api/userVideos'
import toast from 'react-hot-toast'

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string

interface UploadVideoProps {
  onSuccess: () => void
  onCancel: () => void
}

export const UploadVideo = ({ onSuccess, onCancel }: UploadVideoProps) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [dragging, setDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('video/')) {
      toast.error('Выберите видеофайл')
      return
    }
    setVideoFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setTitle((prev) => prev || file.name.replace(/\.[^.]+$/, ''))
  }, [])

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const uploadToCloudinary = (file: File): Promise<{ url: string; thumbnail: string; duration: number }> =>
    new Promise((resolve, reject) => {
      if (!CLOUD_NAME || !UPLOAD_PRESET) {
        reject(new Error('Cloudinary не настроен. Добавьте VITE_CLOUDINARY_CLOUD_NAME и VITE_CLOUDINARY_UPLOAD_PRESET в .env'))
        return
      }

      const fd = new FormData()
      fd.append('file', file)
      fd.append('upload_preset', UPLOAD_PRESET)

      const xhr = new XMLHttpRequest()
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`)

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 85))
      }

      xhr.onload = () => {
        const data = JSON.parse(xhr.responseText)
        if (xhr.status === 200) {
          const thumbnail = `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/so_0,w_640,h_360,c_fill/${data.public_id}.jpg`
          resolve({ url: data.secure_url, thumbnail, duration: Math.round(data.duration ?? 0) })
        } else {
          reject(new Error(data.error?.message ?? 'Ошибка загрузки на Cloudinary'))
        }
      }

      xhr.onerror = () => reject(new Error('Ошибка сети'))
      xhr.send(fd)
    })

  const handleSubmit = async () => {
    if (!videoFile) { toast.error('Выберите видеофайл'); return }
    if (!title.trim()) { toast.error('Введите название'); return }

    setUploading(true)
    setProgress(0)

    try {
      const { url, thumbnail, duration } = await uploadToCloudinary(videoFile)
      setProgress(92)

      const res = await createUserVideo({
        title: title.trim(),
        description: description.trim() || undefined,
        videoUrl: url,
        thumbnailUrl: thumbnail,
        duration,
      })

      if (!res.success) throw new Error('Ошибка сохранения')

      setProgress(100)
      toast.success('Видео опубликовано!')
      onSuccess()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Неизвестная ошибка'
      toast.error(msg)
    } finally {
      setUploading(false)
    }
  }

  if (!videoFile) {
    return (
      <div
        className={`${styles.dropzone} ${dragging ? styles.dragging : ''}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <svg className={styles.uploadIcon} viewBox="0 0 24 24">
          <path fill="currentColor" d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
        </svg>
        <p className={styles.dropTitle}>Перетащите видео сюда</p>
        <p className={styles.dropSub}>или нажмите для выбора</p>
        <p className={styles.dropHint}>MP4, MOV, AVI, WebM · до 2 ГБ</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          className={styles.hiddenInput}
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </div>
    )
  }

  return (
    <div className={styles.form}>
      <div className={styles.previewWrap}>
        <video src={previewUrl ?? ''} controls className={styles.preview} />
      </div>

      <div className={styles.fields}>
        <p className={styles.fileName}>
          {videoFile.name} &nbsp;·&nbsp; {(videoFile.size / 1024 / 1024).toFixed(1)} МБ
        </p>

        <label className={styles.label}>
          Название *
          <input
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Введите название"
            maxLength={200}
            disabled={uploading}
          />
        </label>

        <label className={styles.label}>
          Описание
          <textarea
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Расскажите о видео..."
            rows={3}
            disabled={uploading}
          />
        </label>

        {uploading && (
          <div className={styles.progressWrap}>
            <div className={styles.progressBar} style={{ width: `${progress}%` }} />
            <span className={styles.progressText}>{progress < 100 ? `Загрузка ${progress}%` : 'Сохранение...'}</span>
          </div>
        )}

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onCancel} disabled={uploading}>
            Отмена
          </button>
          <button className={styles.submitBtn} onClick={handleSubmit} disabled={uploading || !title.trim()}>
            {uploading ? 'Публикация...' : 'Опубликовать'}
          </button>
        </div>
      </div>
    </div>
  )
}
