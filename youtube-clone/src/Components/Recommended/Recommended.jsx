import styles from './Recommended.module.css'
import { useEffect, useState } from 'react'
import { API_KEY } from '../../utils/data'
import { value_converter } from '../../utils/data'
import { Link } from 'react-router-dom'
import { formatDuration } from '../../utils/formatDuration'
import { SaveButton } from '../SaveButton/SaveButton'
import { memo } from 'react'
const Recommended = ({ categoryId }) => {
  const [apiData, setApiData] = useState([])
  const [openMenuId, setOpenMenuId] = useState(null) // Для открытого меню

  const fetchData = async () => {
    const relatedVideo_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=40&regionCode=US&videoCategoryId=${categoryId}&key=${API_KEY}`
    await fetch(relatedVideo_url)
      .then((res) => res.json())
      .then((data) => setApiData(data.items))
  }

  useEffect(() => {
    fetchData()
  }, [categoryId])

  // Закрываем меню при клике вне его
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenuId(null)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const handleMenuClick = (e, videoId) => {
    e.preventDefault() // Не переходим по ссылке
    e.stopPropagation() // Не закрываем меню сразу
    setOpenMenuId(openMenuId === videoId ? null : videoId)
  }


  return (
    <div className={styles.recommended}>
      {apiData.map((item, index) => {
        const videoId = item.id

        return (
          <div key={index} className={styles.side_video_list}>
            <Link
              to={`/video/${item.snippet.categoryId}/${item.id}`}
              className={styles.video_link}
              style={{ display: 'flex', gap: '10px', width: '100%' }}
            >
              <div className={styles.thumbnail_container}>
                <img src={item.snippet.thumbnails.medium.url} alt="" />
                <div className={styles.duration}>
                  {formatDuration(item.contentDetails.duration)}
                </div>
              </div>

              <div className={styles.vid_info}>
                <h4>{item.snippet.title}</h4>
                <p>{item.snippet.channelTitle}</p>
                <p>{value_converter(item.statistics.viewCount)} Views</p>
              </div>
            </Link>

            {/* Кнопка меню */}
            <button
              className={styles.menu_button}
              onClick={(e) => handleMenuClick(e, videoId)}
              aria-label="Меню видео"
            />

            {/* Выпадающее меню */}
            {openMenuId === videoId && (
              <div className={styles.dropdown_menu}>
                <div
                  className={styles.dropdown_item}
                  onClick={(e) => handleMenuItemClick(e, 'save', item)}
                >
                  <SaveButton videoId={videoId} />
                </div>

                <div
                  className={styles.dropdown_item}
                  onClick={(e) => handleMenuItemClick(e, 'channel', item)}
                >
                  <Link to={`/channel/${item.snippet.channelId}`}>
                    
                  <span>Перейти на канал</span>
                      
                    
                  </Link>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default memo(Recommended)
