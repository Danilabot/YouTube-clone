import styles from './Recommended.module.css'
import { useEffect, useState } from 'react'
import { API_KEY } from '../../utils/data'
import { value_converter } from '../../utils/data'
import { Link } from 'react-router-dom'
import { formatDuration } from '../../utils/formatDuration'

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

  const handleMenuItemClick = (e, action, video) => {
    e.preventDefault()
    e.stopPropagation()
    setOpenMenuId(null)
    
    // Действия меню
    switch(action) {
      case 'save':
        console.log('Сохранить видео:', video.snippet.title)
        // Тут логика сохранения
        break
      case 'later':
        console.log('Смотреть позже:', video.snippet.title)
        // Тут логика "смотреть позже"
        break
      case 'channel':
        console.log('Перейти на канал:', video.snippet.channelTitle)
        // Тут навигация на канал
        break
      case 'not_interested':
        console.log('Не интересно:', video.snippet.title)
        // Тут скрытие видео
        break
      default:
        break
    }
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
                  <span>Сохранить в плейлист</span>
                </div>
                <div 
                  className={styles.dropdown_item}
                  onClick={(e) => handleMenuItemClick(e, 'later', item)}
                >
                  <span>Смотреть позже</span>
                </div>
                <div 
                  className={styles.dropdown_item}
                  onClick={(e) => handleMenuItemClick(e, 'channel', item)}
                >
                  <span>Перейти на канал</span>
                </div>
                <div 
                  className={styles.dropdown_item}
                  onClick={(e) => handleMenuItemClick(e, 'not_interested', item)}
                >
                  <span>Не интересно</span>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default Recommended