import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getHistory, clearHistory } from '../../utils/history'
import { formatDistanceToNow } from 'date-fns'
import styles from './History.module.css'

export const History = () => {
  const [history, setHistory] = useState(getHistory)

  const handleClear = () => {
    clearHistory()
    setHistory([])
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>История просмотров</h1>
        {history.length > 0 && (
          <button className={styles.clearBtn} onClick={handleClear}>
            Очистить историю
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className={styles.empty}>
          <p>История просмотров пуста</p>
          <Link to="/" className={styles.link}>На главную</Link>
        </div>
      ) : (
        <div className={styles.list}>
          {history.map((item) => (
            <Link
              key={`${item.id}-${item.watchedAt}`}
              to={`/video/${item.categoryId}/${item.id}`}
              className={styles.item}
            >
              <div className={styles.thumbnail}>
                <img src={item.thumbnail} alt={item.title} />
              </div>
              <div className={styles.info}>
                <p className={styles.videoTitle}>{item.title}</p>
                <p className={styles.channel}>{item.channelTitle}</p>
                <p className={styles.time}>
                  {formatDistanceToNow(new Date(item.watchedAt), { addSuffix: true })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
